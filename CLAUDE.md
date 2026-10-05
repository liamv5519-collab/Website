# Notes for Claude

## Creation Shelf

The user keeps everything Claude makes in one library app:
https://claude.ai/artifact/EnXfRZTCc92y32zjDdoG1M

Whenever you finish making something for the user (a video, picture, website,
document, code project, or anything else with a link), add a card for it.
Write a document to the artifact's database with the `ArtifactData` tool:

- `url`: the artifact link above
- `collection`: `items`
- `doc_id`: a short slug, e.g. `roofing-ad-reels`
- `data`:
  - `title` (string)
  - `category`: one of `video`, `image`, `website`, `document`, `code`, `other`
  - `url`: the main https link where the user can open it
  - `links`: extra links as `[{ "label": "Download MP4", "url": "https://..." }]` (or `[]`)
  - `meta`: short specs, e.g. `1080×1920 · 9:16 · 5 s`
  - `project`: the project it belongs to, e.g. `Roofing ad`
  - `description`: one or two plain sentences
  - `tags`: lowercase strings
  - `thumb`: an asset id for a preview image, or `null`
  - `createdAt`: ISO timestamp

For a preview image, upload a small PNG/JPG/WebP with the `Artifact` tool
(`url` = the link above, `asset: true`, `file_path`) and put the returned
32-character id in `thumb`. Use links the user can actually open, such as a
GitHub file on the pushed branch, a published artifact, or a live site.
