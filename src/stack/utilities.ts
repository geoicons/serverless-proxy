export function generate_composite_string(input: string, stack_name: string, separator: string = "") {
    const result = input + separator + stack_name;
    return result;
}

export function append_prefix(input: string, prefix: string) {
    return prefix + "-" + input;
}
