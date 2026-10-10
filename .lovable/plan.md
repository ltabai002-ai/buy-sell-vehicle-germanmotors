# German Motors vehicle inventory upgrade

## Preserve your website
Keep the existing public design, branding, navigation, typography, vehicle cards, image proportions, and mobile layout. Add vehicle management at `/admin`; do not create a replacement website.

The current project is a static HTML/CSS/JavaScript website with a packaging script and no configured backend visible in its project files. Its original application framework is no longer present, so the upgrade also needs compatible application routing and publishing setup while preserving the existing public presentation.

## What will change
1. Enable Lovable Cloud for the shared database, administrator sign-in, and image storage. Inspect its existing resources before creating anything to avoid duplicates.
2. Set up administrator-only access, disable public self-registration, and provide invitation-based initial administrator provisioning. Never embed passwords or grant administrator access through browser settings.
3. Create vehicle records, related image records, and dedicated image storage. Keep registration numbers private, with explicit approval required for public display.
4. Build `/admin` with inventory counts, searchable and paginated listings, publication/availability/fuel/transmission filters, and add/edit/preview/publish/unpublish/sold/archive/delete actions. Require confirmation before deletion.
5. Add the complete vehicle form from your brief. Support incomplete drafts, validate required publication fields, and leave unknown details empty.
6. Add JPG, PNG, and WebP uploads with previews, progress, errors, cover selection, reordering, and removal. Set a clear file-size limit and use optimized delivery where available.
7. Replace hardcoded public cards and modal data with published, available vehicles from Cloud. Preserve existing card and detail styling, gallery, navigation, and finance calculator. Include loading, empty, and error states that fit the existing design.
8. Test the complete lifecycle, image handling, refresh persistence, administrator access, and public read/write restrictions; verify successful automatic publishing builds.

## Existing vehicle data
Do not automatically import the six hardcoded cars as verified inventory. Their descriptions contain assertions about ownership, inspections, warranties, and service history, and their stock-photo galleries need accuracy checks. Preserve the source records for reference; request confirmation before migrating them into live listings. Until confirmed listings are available, show the designed empty-inventory state rather than invented vehicles.

## Technical details
- Existing files involved: `index.html`, `styles.css`, `script.js`, `package.json`, and `scripts/build.mjs`. Preserve public markup/styles and extract only inventory-specific behavior as necessary.
- Restore supported TanStack Start routing/configuration for `/`, administrator pages, sign-in, and server logic without changing the visible public website. Update the existing static packaging rule only where the new runtime requires it; retain local images and existing global-handler behavior until migrated.
- Schema: `vehicles`, `vehicle_images`, a private registration-details record, and a separate `user_roles` table. Include timestamps, foreign keys, publication validation, appropriate indexes, explicit grants, and Row Level Security.
- Public reads return only safe published/available fields and associated listing images. Authorized administrators can read drafts and private details. Enforce all mutations in database/storage policies and authenticated server handlers where used.
- Keep unpublished images private; public access must depend on the related vehicle being published and available. Account for vehicle deletion, gallery updates, storage cleanup, and failed uploads without deleting unrelated files.
- Use the generated Cloud clients, managed authentication gate, and authenticated server-function conventions. Never expose privileged credentials.
- Give each page its own meaningful title and sharing metadata.

## Verification and completion
Verify an authorized administrator can add a car with multiple photos, edit it, publish it, see changes on the unchanged public website, mark it sold, archive it, and delete it. Verify draft/private data and unauthorized uploads/writes are blocked. Test both desktop and mobile layouts.

Initial administrator provisioning requires the administrator’s email after Cloud setup. Importing existing inventory requires confirmation of its accuracy. These are the only expected user-input dependencies; no credentials should be pasted into chat.