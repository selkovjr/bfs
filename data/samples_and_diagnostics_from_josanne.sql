DROP TABLE j_samples;
SELECT * INTO j_samples FROM samples LIMIT 0;
\copy j_samples from josanne-samples.tab

DROP TABLE j_diagnostics;
SELECT * INTO j_diagnostics FROM diagnostics LIMIT 0;
\copy j_diagnostics from josanne-diagnostics.tab
