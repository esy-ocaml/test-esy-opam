const pkgs = {
  "ocamlfind": "*",
  "jbuilder": "*",
  "cppo": "*",
  "result": "*",
  "ocamlbuild": "*",
  "topkg": "*",
  "ocaml-migrate-parsetree": "*",
  "menhir": "*",
  "camlp5": "*",
  "ppx_tools_versioned": "*",
  "yojson": "*",
  "biniou": "*",
  "easy-format": "*",
  "lwt": "*",
  "sexplib": "*",
  "ppx_type_conv": "*",
  "ppx_driver": "*",
  "ppx_core": "*",
  "camlp4": "*",
  "cmdliner": "*",
  "ppx_sexp_conv": "*",
  "ppx_optcomp": "*",
  "ppx_tools": "*",
  "ounit": "*",
  "stdio": "*",
  "base": "*",
  "ppx_ast": "*",
  "ocaml-compiler-libs": "*",
  "ppx_metaquot": "*",
  "ppx_traverse_builtins": "*",
  "ppx_deriving": "*",
  "ppx_fields_conv": "*",
  "fieldslib": "*",
  "re": "*",
  "ppx_compare": "*",
  "camomile": "*",
  "react": "*",
  "cppo_ocamlbuild": "*",
  "ppx_enumerate": "*",
  "xmlm": "*",
  "configurator": "*",
  "bin_prot": "*",
  "core_kernel": "*",
  "zed": "*",
  "lambda-term": "*",
  "zarith": "*",
  "ppx_hash": "*",
  "core": "*",
  "ppx_variants_conv": "*",
  "ppx_custom_printf": "*",
  "ppx_base": "*",
  "utop": "*",
  "octavius": "*",
  "variantslib": "*",
  "ppx_bin_prot": "*",
  "ppx_js_style": "*",
  "uchar": "*",
  "ppx_expect": "*",
  "ppx_jane": "*",
  "ppx_here": "*",
  "ppx_assert": "*",
  "ppx_typerep_conv": "*",
  "ppx_sexp_value": "*",
  "ppx_sexp_message": "*",
  "typerep": "*",
  "ppx_inline_test": "*",
  "lwt_react": "*",
  "ppx_let": "*",
  "ppx_fail": "*",
  "ppx_bench": "*",
  "ppx_pipebang": "*",
  "ppx_derivers": "*",
  "base64": "*",
  "ppx_traverse": "*",
  "uutf": "*",
  "ocp-build": "*",
  "merlin": "*",
  "ppx_optional": "*",
  "oasis": "*",
  "uri": "*",
  "cryptokit": "*",
  "jane-street-headers": "*",
  "stringext": "*",
  "spawn": "*",
  "ocamlmod": "*",
  "ocamlify": "*",
  "ipaddr": "*",
  "depext": "*",
  "fmt": "*",
  "cohttp": "*",
  "num": "*",
  "cstruct": "*",
  "logs": "*",
  "ctypes": "*",
  "astring": "*",
  "bisect_ppx": "*",
  "jsonm": "*"
};

const toolchains = ["~4.2.3000", "~4.6.1"];

const child_process = require('child_process');
const fs = require('fs');
const path = require('path');

const ESYI = process.env.ESYI || 'esyi';
const ESY = process.env.ESY || 'esy';

child_process.execSync(`which ${ESYI}`, {stdio: 'inherit'});
child_process.execSync(`which ${ESY}`, {stdio: 'inherit'});

fs.mkdirSync('_build');

for (let toolchain of toolchains) {

  fs.mkdirSync(path.join('_build', toolchain));

  for (let pkg in pkgs) {

    console.log(`Testing ${pkg} with ocaml@${toolchain}`);
    const sandboxPath = path.join('_build', toolchain, pkg);

    const packageJson = {
      name: `test-${pkg}`,
      version: '0.0.0',
      esy: {build: ['true']},
      dependencies: {
        ['@opam/' + pkg]: pkgs[pkg]
      },
      devDependencies: {
        ocaml: toolchain
      }
    };

    fs.mkdirSync(sandboxPath);
    fs.writeFileSync(
      path.join(sandboxPath, 'package.json'),
      JSON.stringify(packageJson, null, 2)
    );

    child_process.execSync(`${ESYI}`, {
      cwd: sandboxPath,
      stdio: 'inherit',
    });

    child_process.execSync(`${ESY} build`, {
      cwd: sandboxPath,
      stdio: 'inherit',
    });

  }
}
