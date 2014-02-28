# BFS database schema

This is a poor man's IDE for developing database schemata. It uses an SGML
docmuent as a source, visualised as an HTML-mapped image. It also generates
loadable SQL to initialise the database.

[Browse the schema](https://rawgithub.com/selkovjr/bfs/master/schema/bfs-schema.html)

## Requirements:

* **nsgmls** (part of **sp** or **opensp**)
* **graphviz**

In Ubuntu, these requirements are satisfied with:

```bash
sudo aptitude install libgraphviz-perl sp
```

## Synopsis:

* Run `make`
* Point your browser at `bfs-schema.html`
* Initialise the database:

    ```sh
    createdb bfs
    psql bfs < bfs-schema.sql
    ```

## Developing the schema

Any text editor works fine. It is easy to copy and fix existing classes to
create new ones. An SGML-aware editor, such as **psgml** mode in **emacs**, makes
it easy to write a new schema from scratch.

## Developing the doctype

The doctype, `metadata.dtd`, was created in **Near&Far** (`nearfar.exe`), which can be
run under **wine**. The source file for it is `metadata.mbf`. It is not a
dependency in the schema-making process; it has been more than a dozen years
since I had to amend the doctype, and even then it was probably done by hand.

If the doctype is edited in  **Near&Far**, the exported file needs to be cleaned
of carriage return characters with `copydtd`.
