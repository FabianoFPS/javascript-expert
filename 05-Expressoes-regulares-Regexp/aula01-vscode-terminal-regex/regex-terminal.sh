# rodar a partir da raiz do projeto
find ../../ -name *.test.js
find ../../ -name *.test.js -not -path '*node_modules**'
find ../../ -name *.js -not -path '*node_modules**'

# npm init -y && npm i ipt
find ../../ -name *test.js -not -path '*node_modules**'  | npx ipt
find ../../ -name *.js -not -path '*node_modules**' | npx ipt

CONTENT="'use strict';" && \
find ./desafio -name *.js -not -path '*node_modules**' \
| npx ipt -o \
| xargs -I '{file}' echo '->' {file}

# 1s primeira linha
# ^ primeira coluna
# sintase -e /conteudo a ser substituido/substituir por/ * as barras / delimitam
CONTENT="'use strict';" && \
find ./desafio -name '*.js' -not -path '*node_modules**' \
| npx ipt -o \
| xargs -I '{file}' sed -i -e "1s/^/${CONTENT}\n/g" {file}

find ./desafio -name '*.js' -not -path '*node_modules**' \
| npx ipt -o \
| xargs -I '{file}' sed -i -e "1s/^/'use strict';/g" {file}

# TUDO
CONTENT="'use strict';" && \
find ./desafio -name '*.js' -not -path '*node_modules**' \
| npx ipt -o \
| xargs -I '{file}' sed -i -e "1s/^/${CONTENT}\n/g" {file}