BEGIN TRANSACTION;
\copy birds from domestic_birds.tab
\copy birds from birds.tab
\copy samples from samples.tab
\copy diagnostics from diagnostics.tab
\copy cultures from cultures.tab
\copy sera from sera.tab
END TRANSACTION;
