Projects
- file: data/projects.json
- fields: id (string, unique), title, tag, meta, preview, previewAlt, summary, details, list (array of strings)
- modal id is built as project-<id>
- language files: data/projects.de.json, data/projects.en.json

Experience
- file: data/experience.json
- fields: time, title, company, summary (string with line breaks or array of strings)
- language files: data/experience.de.json, data/experience.en.json

Skills
- file: data/skills.json
- fields: title, items (array of strings), layout (optional: "tags")
- language files: data/skills.de.json, data/skills.en.json

Education
- file: data/education.json
- fields: degree, school, period
- language files: data/education.de.json, data/education.en.json

Site
- file: data/site.json
- fields: pageTitle, logo, navProjects, navExperience, navEducation, navSkills, navContacts, hero*, contact*, availability*, footerText
- language files: data/site.de.json, data/site.en.json
