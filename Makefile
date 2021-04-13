.PHONY: asdf-install-pre
asdf-install-pre:
	brew bundle

.PHONY: asdf-install
asdf-install:
	(asdf plugin-add nodejs https://github.com/asdf-vm/asdf-nodejs.git || true) && (asdf plugin-update nodejs || true) && (asdf install nodejs || true)

.PHONY: asdf-install-post
asdf-install-post:
	asdf reshim

.PHONY: init
init: asdf-install-pre asdf-install asdf-install-post
