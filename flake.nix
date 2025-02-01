{
  inputs = {
    nixpkgs.url = "github:nixos/nixpkgs/nixos-24.11";
    systems.url = "github:nix-systems/default";
  };

  outputs = {
    self,
    systems,
    nixpkgs,
    ...
  }: let
    eachSystem = f:
      nixpkgs.lib.genAttrs (import systems) (system:
        f {
          pkgs = nixpkgs.legacyPackages.${system};
          inherit system;
        });
  in rec {
    formatter = eachSystem ({pkgs, ...}: pkgs.alejandra);

    packages = eachSystem ({pkgs, ...}: {
      default = pkgs.buildNpmPackage {
        name = "build-event-protocol-viewer";
        version = "0.1.0";
        src = pkgs.nix-gitignore.gitignoreSource [] ./.;
        env = {
          NIX_GIT_REVISION = self.rev or self.dirtyRev or "dirty";
        };
        # Let's try importNpmLock so we do't have to manually update a hash
        # so that dependabot can do its job
        # https://github.com/NixOS/nixpkgs/blob/master/doc/languages-frameworks/javascript.section.md#importnpmlock-javascript-buildnpmpackage-importnpmlock
        npmDeps = pkgs.importNpmLock {
          npmRoot = ./.;
        };
        npmConfigHook = pkgs.importNpmLock.npmConfigHook;
        npmBuild = "npm run build";
        # nix-gitignore doesn't seem to keep the generated directory
        preBuild = "mkdir -p ./src/lib/generated && npm run genprotobuf";
        installPhase = ''
          mkdir $out
          cp -r build/* $out
        '';
        doCheck = true;
        checkPhase = ''
          npm run lint
          npm run check
          npm run test
        '';
      };
    });

    apps = eachSystem ({
      system,
      pkgs,
    }: let
      server = pkgs.writeShellScriptBin "server" ''
        ${pkgs.python3}/bin/python -m http.server 8080 -b 127.0.0.1 -d ${packages.${system}.default}
      '';
    in {
      default = {
        type = "app";
        program = "${server}/bin/server";
      };
    });

    devShells = eachSystem ({pkgs, ...}: {
      default = pkgs.mkShell {
        buildInputs = [
          pkgs.nodejs
          pkgs.nodePackages.typescript
          pkgs.nodePackages.typescript-language-server
        ];
      };
    });
  };
}
