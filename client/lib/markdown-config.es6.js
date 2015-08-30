const renderer = new marked.Renderer();
renderer.link = (href, title, text) => `<a href="${href}" target="_blank">${text}</a>`;
marked.setOptions({
    renderer: renderer,
    gfm: true,
    tables: true,
    breaks: true,
    pedantic: false,
    sanitize: false,
    smartLists: true,
    smartypants: false
});
