import fs from 'node:fs';
import path from 'node:path';

import { port, environment } from '../config';

const bannerLoader = async () => {
  const pkgPath = path.resolve(__dirname, '..', '..', 'package.json');
  const pkg = JSON.parse(fs.readFileSync(pkgPath, 'utf8')) as { version?: string };
  const version = pkg.version ?? '0.0.0';

  console.log('                           /\$\$                                      /\$\$');
  console.log('                          | \$\$                                     |__/');
  console.log(
    ' /\$\$\$\$\$\$\$   /\$\$\$\$\$\$   /\$\$\$\$\$\$\$  /\$\$\$\$\$\$          /\$\$\$\$\$\$   /\$\$\$\$\$\$  /\$\$',
  );
  console.log(
    '| \$\$__  \$\$ /\$\$__  \$\$ /\$\$__  \$\$ /\$\$__  \$\$ /\$\$\$\$\$\$|____  \$\$ /\$\$__  \$\$| \$\$',
  );
  console.log(
    '| \$\$  \\ \$\$| \$\$  \\ \$\$| \$\$  | \$\$| \$\$\$\$\$\$\$\$|______/ /\$\$\$\$\$\$\$| \$\$  \\ \$\$| \$\$',
  );
  console.log(
    '| \$\$  | \$\$| \$\$  | \$\$| \$\$  | \$\$| \$\$_____/        /\$\$__  \$\$| \$\$  | \$\$| \$\$',
  );
  console.log(
    '| \$\$  | \$\$|  \$\$\$\$\$\$/|  \$\$\$\$\$\$\$|  \$\$\$\$\$\$\$       |  \$\$\$\$\$\$\$| \$\$\$\$\$\$\$/| \$\$',
  );
  console.log('|__/  |__/ \\______/  \\_______/ \\_______/        \\_______/| \$\$____/ |__/');
  console.log('                                                         | \$\$          ');
  console.log('                                                         | \$\$          ');
  console.log('                                                         |__/          ');

  console.log(`  env     : ${environment}`);
  console.log(`  port    : ${port}`);
  console.log(`  version : ${version}`);
};

export default bannerLoader;
