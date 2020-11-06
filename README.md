# jsonresume-theme-compact
A compact Material UI JSON Resume theme built with Charge/React

## Usage
Set the `RESUME_PATH` variable in a `.env` file and run `yarn start` to launch the development server

## Updating schema
Run `yarn build-types` to update the JSON Resume TypeScript schema. You will have to add a `hideOnPrint?: boolean;` to the `projects` section.