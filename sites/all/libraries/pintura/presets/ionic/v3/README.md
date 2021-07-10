# Readme

Importing external JavaScript files isn't possible on Ionic v3, the files aren't recognized by the internal transpiler and there's no way to instruct the transpiler to recognize the external files.

This forces us to import the JavaScript files in the index.html file using the classic `<script>` tag instead of the `import` statement.

The Pintura Image Editor styles and scripts are added to the `src/assets/pintura` directory. They are then loaded in the index.html file.

The `src/pages/home/home.ts` file demos how we can use Pintura Image Editor within Ionic v3.
