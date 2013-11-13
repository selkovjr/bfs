all: bfs-meta.html bfs-schema.png bfs-schema.sql

bfs-meta.html: bfs-schema.dot
	echo "<!DOCTYPE html PUBLIC \"-//W3C//DTD HTML 4.01//EN\" \"http://www.w3.org/TR/html4/strict.dtd\">" > bfs-schema.html
	echo "<head><title>Graphical database schema</title></head>" >> bfs-schema.html
	echo "<body><div>" >> bfs-schema.html
	echo "<img src=\"bfs-schema.png\" usemap=\"test\#test\" alt=\"graphical database schema\">" >> bfs-schema.html
	./fix_labels bfs-schema.dot | dot -Tcmapx | perl -npe 's/ \/>/>/' >> bfs-schema.html
	echo "</div></body>" >> bfs-schema.html

bfs-schema.png: bfs-schema.dot
	./fix_labels bfs-schema.dot | dot -Tpng > bfs-schema.png

bfs-schema.dot: bfs-schema.sgml parse_sgml
	nsgmls bfs-schema.sgml | ./parse_sgml bfs

bfs-schema.sql: bfs-schema.sgml

clean:
	rm -f bfs-schema.png bfs-meta.html bfs-schema.html bfs-schema.dot bfs-schema.sql *~ *# .#*
