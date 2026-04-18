Theme
- file: data/theme.json
- field: cssVariables (object, keys map to CSS custom properties without the leading --)

Behavior
- file: data/behavior.json
- fields: defaultLang, breakpoints, projects

Content
- dir: data/content/

Projects
- file: data/content/projects.json
- fields: id (string, unique), title, tag, meta, preview, previewAlt, summary, details, list (array of strings)
- modal id is built as project-<id>
- language files: data/content/projects.de.json, data/content/projects.en.json

Experience
- file: data/content/experience.json
- fields: time, title, company, summary (string with line breaks or array of strings)
- language files: data/content/experience.de.json, data/content/experience.en.json

Skills
- file: data/content/skills.json
- fields: title, items (array of strings), layout (optional: "tags")
- language files: data/content/skills.de.json, data/content/skills.en.json

Education
- file: data/content/education.json
- fields: degree, school, period
- language files: data/content/education.de.json, data/content/education.en.json

Site
- file: data/content/site.json
- fields: pageTitle, logo, navProjects, navExperience, navEducation, navSkills, navContacts, hero*, contact*, availability*, footerText
- language files: data/content/site.de.json, data/content/site.en.json
