use regex::Regex;

use crate::EngineError;

/// Strip leading whitespaces from HTML.
pub(crate) fn strip_leading_whitespace_from_html(content: &str) -> String {
    content
        .lines()
        .map(|line| {
            if line.trim_start().starts_with('<') && line.starts_with("    ") {
                line.trim_start()
            } else {
                line
            }
        })
        .collect::<Vec<_>>()
        .join("\n")
}

/// Convert text into to a URL-safe slug.
fn slugify(text: &str) -> String {
    text.to_lowercase()
        .chars()
        .filter_map(|c| {
            if c.is_alphanumeric() {
                Some(c)
            } else if c.is_whitespace() || c == '-' || c == '_' {
                Some('-')
            } else {
                None
            }
        })
        .collect::<String>()
        .split('-')
        .filter(|s| !s.is_empty())
        .collect::<Vec<_>>()
        .join("-")
}

/// Generate a unique ID for a string. Handles duplicates by appending an idx.
pub(crate) fn generate_unique_id(
    text: &str,
    used_ids: &mut std::collections::HashSet<String>,
) -> String {
    let base_slug = slugify(text);

    if !used_ids.contains(&base_slug) {
        used_ids.insert(base_slug.clone());
        return base_slug;
    }

    let mut ctr = 1;
    loop {
        let candidate = format!("{base_slug}-{ctr}");
        if !used_ids.contains(&candidate) {
            used_ids.insert(candidate.clone());
            return candidate;
        }
        ctr += 1;
    }
}

/// Inject heading IDs into already-generated HTML
pub(crate) fn inject_heading_ids_into_html(html: &str) -> Result<String, EngineError> {
    use std::collections::HashSet;

    let mut result = html.to_string();
    let mut used_ids = HashSet::new();

    // Regex to match heading tags
    let heading_rgx = Regex::new(r"<(h[1-6])>([^<]+)</h[1-6]>")?;

    result = heading_rgx
        .replace_all(&result, |caps: &regex::Captures| {
            let tag = &caps[1];
            let text = &caps[2];
            let id = generate_unique_id(text, &mut used_ids);

            format!("<{tag} id=\"{id}\">{text}</{tag}>")
        })
        .to_string();

    Ok(result)
}
