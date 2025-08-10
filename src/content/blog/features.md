+++
title = "features"
description = ""
date = "2025-08-09"
template = "blog/blog.html"
+++

# Cypherpunks write code

## Inline Math

The quadratic formula is $x = \frac{-b \pm \sqrt{b^2 - 4ac}}{2a}$.

Einstein's famous equation: $E = mc^2$.

## Display Math

$$ E = mc^2 $$

$$
\int_{-\infty}^{\infty} e^{-x^2} dx = \sqrt{\pi}
$$

## Code Block

```rs
use std::{fs, path::PathBuf};

use serde::{Serialize, Deserialize};

use crate::EngineError;

#[derive(Debug, Serialize, Deserialize)]
pub(crate) struct SiteConfig {
    /// The cannonical name for the site. ($ \int $) <-- this wont render as LaTeX anymore!
    pub(crate) cname: String,
    /// The deafult title for the site.
    pub(crate) title: String,
    /// The default description for the site.
    pub(crate) description: String,
    /// The content directory path, relative to the project's root.
    pub(crate) content_path: String,
    /// The build directory path, relative to the project's root.
    pub(crate) build_path: String,
}

pub(crate) fn parse_config_file(config_path: PathBuf) -> Result<SiteConfig, EngineError> {
    let config_raw: String = fs::read_to_string(config_path)?;
    let config: SiteConfig = toml::from_str(&config_raw)?;

    Ok(config)
}
```

<div class="fullwidth">
    <img src="/img/diogenes-banner.jpg">
</div>

Bitcoin Core[^core] is the reference implementation of the bitcoin consensus protocol, written in `C++`.
It is responsible for building your own copy of the blockchain, connecting to other nodes,
broadcasting transactions and deciding, based on it's own rules[*rule], if a received transaction
block is valid or not. Your API to the network, in short.

[^core]:
    This is a numbered sidenote. aaaaaaaaaaaaaaaaaaluUîc ccnlflsfsglf;ga;gkwjklfjewkjfkl
    ndfndfnjdnfdfjn gjfkjgfkjgklf.

[*rule]: This NOT a numbered sidenote.

![And Diogened said: "Yes, stand a little out of my sun (ἀπὸ τοῦ ἡλίου μετάστηθι)"](/img/diogenes-banner.jpg)

Tufte CSS provides tools to style web articles using the ideas demonstrated by Edward Tufte’s books and handouts. Tufte’s style is known for its simplicity, extensive use of sidenotes, tight integration of graphics with text, and carefully chosen typography.

![](/img/zuck.gif)

Tufte CSS was created by Dave Liepmann and is now an Edward Tufte project. The original idea was cribbed from Tufte-LaTeX and R Markdown’s Tufte Handout format. We give hearty thanks to all the people who have contributed to those projects.

<figure>
    <img src="/img/reim.png">
    <figcaption>Real and Imaginary</figcaption>
</figure>

If you see anything that Tufte CSS could improve, we welcome your contribution in the form of an issue or pull request on the GitHub project: tufte-css. Please note the contribution guidelines.

<div class="fullwidth">
    <img src="/img/wave.jpeg">
</div>

> First step to not being a noob is to not think like a noob. If you think like a noob,
    you're a noob. Noobs ask questions like, 'If only I had a college degree, the world
    would open up to me, right?' No. That's newb thinking. You're looking for validation
    from other people instead of skill.\n\nThe system isn't a conspiracy, like there's
    someone pulling the strings. It’s just a decentralized dystopia—everyone buying
    into everyone else’s limitations. Power isn't what you have; it’s what the other
    person thinks you have.\n\nTo stop being a noob, stop engaging with the system.
    Don’t let validation define you. Build systems that don’t involve social capital,
    legitimacy, or who you are—just pure technicality. Bitcoin’s a great example.
    It doesn’t care where its coins come from. It’s just technicality,
    not artificial barriers of control."

Finally, a reminder about the goal of this project. The web is not print. Webpages are not books. Therefore, the goal of Tufte CSS is not to say “websites should look like this interpretation of Tufte’s books” but rather “here are some techniques Tufte developed that we’ve found useful in print; maybe you can find a way to make them useful on the web”. Tufte CSS is merely a sketch of one way to implement this particular set of ideas. It should be a starting point, not a design goal, because any project should present their information as best suits their particular circumstances.

```rs
/// Process inline (`$ <expr> $`) and display (`$$ <expr> $$) LaTeX into HTML with `katex`.
///
/// The KaTeX CSS file must be available. You can get it from
/// https://cdn.jsdelivr.net/npm/katex@0.16.22/dist/katex.css
fn process_katex(content: &str) -> Result<String, EngineError> {
    let mut result = content.to_string();

    // Exclude code blocks from `katex` processing
    // by matching and removing them temporarily.
    let mut ctr = 0;
    let mut code_blocks = Vec::new();
    let code_block_rgx = Regex::new(r"(?s)```[^\n]*\n.*?```")?;
    result = code_block_rgx
        .replace_all(&result, |caps: &regex::Captures| {
            let placeholder = format!("__CODE_BLOCK_PLACEHOLDER_{ctr}__");
            code_blocks.push(caps[0].to_string());
            ctr += 1;
            placeholder
        })
        .to_string();

    // Render display math: $$ <expr> $$
    let display_rgx = Regex::new(r"(?s)\$\$(.*?)\$\$")?;
    let mut processed = display_rgx
        .replace_all(&result, |caps: &regex::Captures| {
            let math = caps[1].trim();
            match katex::render_with_opts(
                math,
                katex::Opts::builder().display_mode(true).build().unwrap(),
            ) {
                Ok(rendered) => rendered,
                Err(_) => "wtf".to_owned(),
            }
        })
        .to_string();

    // Render inline math: $ <expr> $
    let inline_rgx = Regex::new(r"\$([^$\n]+?)\$")?;
    processed = inline_rgx
        .replace_all(&processed, |caps: &regex::Captures| {
            let math = caps[1].trim();
            match katex::render(math) {
                Ok(rendered) => rendered,
                Err(e) => {
                    println!("display not rendered: {e}");
                    "wtf".to_owned()
                }
            }
        })
        .to_string();

    // Insert code blocks back by matching and replacing.
    for (i, code_block) in code_blocks.iter().enumerate() {
        let placeholder = format!("__CODE_BLOCK_PLACEHOLDER_{i}__");
        processed = processed.replace(&placeholder, code_block);
    }

    Ok(processed)
}
```
