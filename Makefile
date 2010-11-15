

VERSION=audioalert-1.0


all: archive

javascript:
	yui-compressor -o $(VERSION).min.js src/audioalert.js

actionscript:
	mxmlc -source-path ./src -output $(VERSION).swf -file-specs ./src/audioalert.as


archive: javascript actionscript
	mkdir /tmp/$(VERSION)
	cp -rf ./* /tmp/$(VERSION)
	cd /tmp && tar zcvf $(VERSION).tar.gz $(VERSION)
	rm -rf /tmp/$(VERSION)
	mv /tmp/$(VERSION).tar.gz .

clean:
	rm $(VERSION).min.js $(VERSION).swf $(VERSION).tar.gz
