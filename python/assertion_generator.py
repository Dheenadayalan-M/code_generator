import json
from typing import Any, Dict, List

loop_index_counter = 0  # Global loop index counter
SKIP_KEYS = {"accountNumber","partyId","externalRefNo","counterParty","contractRefNo", "branch", "currencyCode","makerId","makerDtStamp","makerRemarks","checkerId","checkerDtStamp","checkerRemarks","branchCode","brnCode","brn","arg","information","override","overrideAuthLevelsReqd","error","type","language","requestId","httpStatusCode","overrideAuthLevelsReqd","id","iD","args","keyId"}  # Keys to skip assertions for

def generate_postman_assertions_named_match_counter(input_json: Dict, metadata: Dict) -> str:
    def get_key_path_string(path: List[str]) -> str:
        return '.'.join(path)

    def get_primary_keys_for_path(metadata: Dict[str, List[str]], path: List[str]) -> List[str]:
        return metadata.get(get_key_path_string(path), [])

    def generate_index_variable() -> str:
        global loop_index_counter
        idx = f"i{loop_index_counter}"
        loop_index_counter += 1
        return idx

    def generate_variable_name(path: List[str]) -> str:
        return path[-1]

    def format_value(value: Any) -> str:
        return json.dumps(value)

    def generate_primary_key_condition(item_var: str, pk: Dict[str, Any]) -> str:
        return ' && '.join(f'{item_var}.{k} == {format_value(v)}' for k, v in pk.items())

    def generate_assertions(output: List[str], obj: Dict, var_prefix: str, indent: str):
        for key, value in obj.items():
            if key in SKIP_KEYS:
                continue
            if isinstance(value, (list, dict)):
                continue
            output.append(f'{indent}pm.expect({var_prefix}.{key}).to.eql({format_value(value)});')

    def process_node(output: List[str], node: Any, metadata: Dict, path: List[str],
                     parent_vars: List[str], parent_loop_index: str, parent_is_array: bool):
        indent_level = len(parent_vars) + 1
        indent = "    " * indent_level

        if isinstance(node, list) and node:
            var_name = generate_variable_name(path)
            match_var = f"{var_name}MatchCount"
            loop_index = generate_index_variable()

            parent_access = f"{parent_vars[-1]}[{parent_loop_index}]" if parent_is_array else parent_vars[-1]
            full_var = f"{parent_access}.{var_name}"
            
            assert_var = (', () => {')
            indent_var=('});')


            output.append(f'{indent}var {var_name} = {full_var};')
            output.append(f'{indent}let {match_var} = 0;')
            output.append(f'{indent}for (var {loop_index} = 0; {loop_index} < {var_name}.length; {loop_index}++) {{')

            pks = get_primary_keys_for_path(metadata, path)
            seen_conditions = set()

            for item in node:
                if not isinstance(item, dict):
                    continue
                pk = {k: item[k] for k in pks if k in item}
                if not pk:
                    continue
                condition = generate_primary_key_condition(f'{var_name}[{loop_index}]', pk)
                if condition in seen_conditions:
                    continue
                seen_conditions.add(condition)

                output.append(f'{indent}    if ({condition}) {{')
                generate_assertions(output, item, f'{var_name}[{loop_index}]', indent + "        ")
                for k, v in item.items():
                    if isinstance(v, (list, dict)):
                        process_node(output, v, metadata, path + [k], parent_vars + [var_name], loop_index, True)
                output.append(f'{indent}        {match_var}++;')
                output.append(f'{indent}    }}')

            output.append(f'{indent}}}')
            output.append(f'{indent}pm.test("Match ({match_var}).to.eql({var_name}.length) Matching? " {assert_var}')
            
            output.append(f'{indent}    pm.expect({match_var}).to.eql({var_name}.length);')
            output.append(f'{indent}{indent_var}')

        elif isinstance(node, dict):
            var_name = generate_variable_name(path)
            parent_access = f"{parent_vars[-1]}[{parent_loop_index}]" if parent_is_array else parent_vars[-1]
            full_var = f"{parent_access}.{var_name}"

            output.append(f'{indent}var {var_name} = {full_var};')
            generate_assertions(output, node, var_name, indent)

            for key, value in node.items():
                if isinstance(value, (list, dict)):
                    process_node(output, value, metadata, path + [key], parent_vars + [var_name], parent_loop_index, False)

    output = []

    for top_key, top_value in input_json.items():
        if isinstance(top_value, list) and top_value:
            var_name = top_key
            top_index = generate_index_variable()
            output.append(f'var {var_name} = pm.response.json().{var_name};')
            output.append(f'pm.expect({var_name}.length).to.eql({len(top_value)});')
            output.append(f'for (var {top_index} = 0; {top_index} < {var_name}.length; {top_index}++) {{')
            generate_assertions(output, top_value[0], f'{var_name}[{top_index}]', "    ")
            for key, value in top_value[0].items():
                if isinstance(value, (list, dict)):
                    process_node(output, value, metadata, [top_key, key], [var_name], top_index, True)
            output.append('}')
        elif isinstance(top_value, dict):
            var_name = top_key
            output.append(f'var {var_name} = pm.response.json().{var_name};')
            generate_assertions(output, top_value, var_name, "")
            for key, value in top_value.items():
                if isinstance(value, (list, dict)):
                    process_node(output, value, metadata, [top_key, key], [var_name], "", False)
        else:
            output.append(f'pm.expect(pm.response.json().{top_key}).to.eql({format_value(top_value)});')

    return '\n'.join(output)


