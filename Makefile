
VERSION=audioalert-1.1

all: archive


# Minify javascript with yui-compressor - http://developer.yahoo.com/yui/compressor
javascript:
	yui-compressor -o $(VERSION).min.js src/audioalert.js
	#java -jar yuicompressor-2.4.2.jar -o $(VERSION).min.js src/audioalert.js


# Prerequisittes for compiling actionscript:
#  1. Download the "Open Source Flex SDK" from http://opensource.adobe.com/wiki/display/flexsdk
#
#  2. Create FLEX_HOME environment variable: export FLEX_HOME="/path/to/flexsdk"
#
#  3. Add FLEX_HOME/bin to your path: export PATH=$FLEX_HOME/bin:$PATH
actionscript:
	mxmlc -source-path ./src -output $(VERSION).swf -file-specs ./src/audioalert.as


archive: javascript actionscript
	rm -rf /tmp/$(VERSION)
	mkdir /tmp/$(VERSION)
	cp -rf ./* /tmp/$(VERSION)
	cd /tmp && tar zcvf $(VERSION).tar.gz $(VERSION)
	rm -rf /tmp/$(VERSION)
	mv /tmp/$(VERSION).tar.gz .


clean:
	-rm $(VERSION).min.js
	-rm $(VERSION).swf
	-rm $(VERSION).tar.gz
