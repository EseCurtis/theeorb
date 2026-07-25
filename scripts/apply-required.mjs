import { spawnSync } from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

import sharp from 'sharp';

const rootDir = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const requiredDir = path.join(rootDir, '.required');
const appDir = path.join(rootDir, 'app');
const androidResDir = path.join(appDir, 'android/app/src/main/res');
const androidJavaDir = path.join(appDir, 'android/app/src/main/java');
const appInfoPath = path.join(requiredDir, 'appinfo.json');

const requiredFiles = [
  appInfoPath,
  path.join(requiredDir, 'firebase/google-services.json'),
  path.join(requiredDir, 'firebase/GoogleService-Info.plist'),
  path.join(requiredDir, 'brand/logo-color.png'),
  path.join(requiredDir, 'brand/logo-black.png'),
  path.join(requiredDir, 'brand/logo-white.png'),
  path.join(requiredDir, 'brand/icon.png'),
  path.join(requiredDir, 'brand/splash.png'),
  path.join(requiredDir, 'brand/notification-icon.png'),
];

const androidNotificationSizes = {
  'mipmap-mdpi': 24,
  'mipmap-hdpi': 36,
  'mipmap-xhdpi': 48,
  'mipmap-xxhdpi': 72,
  'mipmap-xxxhdpi': 96,
};

function readJson(filePath) {
  return JSON.parse(fs.readFileSync(filePath, 'utf8'));
}

function writeJson(filePath, value) {
  fs.writeFileSync(filePath, `${JSON.stringify(value, null, 2)}\n`);
}

function assertRequiredFiles() {
  const missingFiles = requiredFiles.filter((filePath) => !fs.existsSync(filePath));

  if (missingFiles.length) {
    throw new Error(`Missing required files:\n${missingFiles.map((filePath) => `- ${path.relative(rootDir, filePath)}`).join('\n')}`);
  }
}

function assertString(value, key) {
  if (typeof value !== 'string' || !value.trim()) {
    throw new Error(`appinfo.json requires a non-empty string at ${key}`);
  }

  return value.trim();
}

function assertNumber(value, key) {
  if (!Number.isInteger(value) || value < 1) {
    throw new Error(`appinfo.json requires a positive integer at ${key}`);
  }

  return value;
}

function readAppInfo() {
  const appInfo = readJson(appInfoPath);

  return {
    ...appInfo,
    app: {
      ...appInfo.app,
      id: assertString(appInfo.app?.id, 'app.id'),
      name: assertString(appInfo.app?.name, 'app.name'),
      shortName: assertString(appInfo.app?.shortName, 'app.shortName'),
      urlScheme: assertString(appInfo.app?.urlScheme, 'app.urlScheme'),
      versionCode: assertNumber(appInfo.app?.versionCode, 'app.versionCode'),
      versionName: assertString(appInfo.app?.versionName, 'app.versionName'),
    },
  };
}

function ensureDir(dirPath) {
  fs.mkdirSync(dirPath, { recursive: true });
}

function copyFile(sourcePath, targetPath) {
  ensureDir(path.dirname(targetPath));
  fs.copyFileSync(sourcePath, targetPath);
}

function replaceInFile(filePath, replacements) {
  let content = fs.readFileSync(filePath, 'utf8');

  for (const [pattern, replacement] of replacements) {
    content = content.replace(pattern, replacement);
  }

  fs.writeFileSync(filePath, content);
}

function buildCssVariables(colors) {
  return [
    `  --background: ${colors.background};`,
    `  --foreground: ${colors.foreground};`,
    `  --surface: ${colors.surface};`,
    `  --surface-muted: ${colors.surfaceMuted};`,
    `  --surface-strong: ${colors.surfaceStrong};`,
    `  --border: ${colors.border};`,
    `  --border-strong: ${colors.borderStrong};`,
    `  --muted: ${colors.muted};`,
    `  --accent: ${colors.accent};`,
    `  --accent-strong: ${colors.accentStrong};`,
    `  --danger: ${colors.danger};`,
    `  --success: ${colors.success};`,
  ].join('\n');
}

function writeAppCss(appInfo) {
  const lightVars = buildCssVariables(appInfo.colors);
  const darkVars = buildCssVariables(appInfo.darkColors);
  const css = `@tailwind base;
@tailwind components;
@tailwind utilities;

:root {
  --app-boundary-x: 1.25rem;
${lightVars}
  --shadow: 0 4px 12px rgba(17, 24, 39, 0.04);
  --safe-area-inset-bottom: env(safe-area-inset-bottom, 0px);
  --safe-area-inset-left: env(safe-area-inset-left, 0px);
  --safe-area-inset-right: env(safe-area-inset-right, 0px);
  --safe-area-inset-top: env(safe-area-inset-top, 0px);
  --statusbar-clearfix: 0px;
}

:root[data-theme='dark'] {
${darkVars}
  --shadow: 0 8px 24px rgba(0, 0, 0, 0.16);
}

html,
body,
#app {
  width: 100%;
  min-height: 100dvh;
  overflow-x: hidden;
}

body {
  margin: 0;
  color: var(--foreground);
  background: var(--background);
  font-family:
    Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI",
    sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  overflow-y: auto;
}

code {
  font-family:
    "SFMono-Regular", Consolas, "Liberation Mono", Menlo, monospace;
}

#app {
  isolation: isolate;
}

.no-scrollbar::-webkit-scrollbar {
  display: none;
}
`;

  fs.writeFileSync(path.join(appDir, 'src/styles.css'), css);
}

function writeWebCss(appInfo) {
  const lightVars = buildCssVariables(appInfo.colors);
  const darkVars = buildCssVariables(appInfo.darkColors);
  const css = `@tailwind base;
@tailwind components;
@tailwind utilities;

:root {
${lightVars}
}

:root[data-theme='dark'] {
${darkVars}
}

html,
body {
  background: var(--background);
  color: var(--foreground);
}

.bg-background {
  background: var(--background);
}

.text-foreground {
  color: var(--foreground);
}

.text-muted {
  color: var(--muted);
}

.border-border {
  border-color: var(--border);
}
`;

  fs.writeFileSync(path.join(rootDir, 'web/src/app/globals.css'), css);
}

function applyCapacitorConfig(appInfo) {
  const configPath = path.join(appDir, 'capacitor.config.json');
  const config = readJson(configPath);

  config.appId = appInfo.app.id;
  config.appName = appInfo.app.name;
  config.webDir = config.webDir ?? 'dist';
  config.server = appInfo.capacitor?.server ?? {};
  config.plugins = {
    ...(config.plugins ?? {}),
    PushNotifications: {
      presentationOptions: ['badge', 'sound', 'alert'],
    },
    Keyboard: {
      resizeOnFullScreen: true,
    },
    SocialLogin: {
      providers: appInfo.socialLogin?.providers ?? {
        google: true,
        apple: true,
        facebook: false,
        twitter: false,
      },
    },
  };

  writeJson(configPath, config);
}

function applyManifest(appInfo) {
  const manifestPath = path.join(appDir, 'public/manifest.json');
  const manifest = readJson(manifestPath);

  manifest.short_name = appInfo.app.shortName;
  manifest.name = appInfo.app.name;
  manifest.theme_color = appInfo.colors.background;
  manifest.background_color = appInfo.colors.background;

  writeJson(manifestPath, manifest);
}

function applyIndexHtml(appInfo) {
  replaceInFile(path.join(appDir, 'index.html'), [
    [/<meta name="theme-color" content="[^"]*" \/>/, `<meta name="theme-color" content="${appInfo.colors.background}" />`],
    [/<title>.*<\/title>/, `<title>${appInfo.app.name}</title>`],
  ]);
}

function applyAndroid(appInfo) {
  copyFile(
    path.join(requiredDir, 'firebase/google-services.json'),
    path.join(appDir, 'android/app/google-services.json'),
  );

  replaceInFile(path.join(appDir, 'android/app/build.gradle'), [
    [/namespace ".*"/, `namespace "${appInfo.app.id}"`],
    [/applicationId ".*"/, `applicationId "${appInfo.app.id}"`],
    [/versionCode \d+/, `versionCode ${appInfo.app.versionCode}`],
    [/versionName ".*"/, `versionName "${appInfo.app.versionName}"`],
  ]);

  replaceInFile(path.join(androidResDir, 'values/strings.xml'), [
    [/<string name="app_name">.*<\/string>/, `<string name="app_name">${appInfo.app.name}</string>`],
    [/<string name="title_activity_main">.*<\/string>/, `<string name="title_activity_main">${appInfo.app.name}</string>`],
    [/<string name="package_name">.*<\/string>/, `<string name="package_name">${appInfo.app.id}</string>`],
    [/<string name="custom_url_scheme">.*<\/string>/, `<string name="custom_url_scheme">${appInfo.app.urlScheme}</string>`],
  ]);

  replaceInFile(path.join(appDir, 'android/app/src/main/AndroidManifest.xml'), [
    [/<data android:scheme="[^"]*"[^>]*\/>/, `<data android:scheme="${appInfo.app.urlScheme}" />`],
  ]);

  applyAndroidJavaPackage(appInfo.app.id);
}

function findMainActivityFile(dirPath) {
  for (const entry of fs.readdirSync(dirPath, { withFileTypes: true })) {
    const fullPath = path.join(dirPath, entry.name);

    if (entry.isDirectory()) {
      const found = findMainActivityFile(fullPath);
      if (found) {
        return found;
      }
    }

    if (entry.isFile() && entry.name === 'MainActivity.java') {
      return fullPath;
    }
  }

  return null;
}

function removeEmptyDirs(dirPath, stopDir) {
  let currentDir = dirPath;

  while (currentDir.startsWith(stopDir) && currentDir !== stopDir) {
    if (fs.readdirSync(currentDir).length) {
      return;
    }

    fs.rmdirSync(currentDir);
    currentDir = path.dirname(currentDir);
  }
}

function applyAndroidJavaPackage(packageName) {
  const packagePath = packageName.split('.').join(path.sep);
  const targetDir = path.join(androidJavaDir, packagePath);
  const targetPath = path.join(targetDir, 'MainActivity.java');
  const currentPath = findMainActivityFile(androidJavaDir);

  if (!currentPath) {
    throw new Error('Unable to find Android MainActivity.java');
  }

  ensureDir(targetDir);
  let content = fs.readFileSync(currentPath, 'utf8');
  content = content.replace(/^package .*;$/m, `package ${packageName};`);
  fs.writeFileSync(targetPath, content);

  if (currentPath !== targetPath) {
    fs.unlinkSync(currentPath);
    removeEmptyDirs(path.dirname(currentPath), androidJavaDir);
  }

  for (const testPath of [
    path.join(appDir, 'android/app/src/test/java/com/getcapacitor/myapp/ExampleUnitTest.java'),
    path.join(appDir, 'android/app/src/androidTest/java/com/getcapacitor/myapp/ExampleInstrumentedTest.java'),
  ]) {
    if (!fs.existsSync(testPath)) {
      continue;
    }

    replaceInFile(testPath, [
      [/^package .*;$/m, `package ${packageName};`],
      [/assertEquals\("[^"]*", appContext\.getPackageName\(\)\);/, `assertEquals("${packageName}", appContext.getPackageName());`],
    ]);
  }
}

function applyIos(appInfo) {
  copyFile(
    path.join(requiredDir, 'firebase/GoogleService-Info.plist'),
    path.join(appDir, 'ios/App/App/GoogleService-Info.plist'),
  );

  replaceInFile(path.join(appDir, 'ios/App/App/Info.plist'), [
    [/<key>CFBundleDisplayName<\/key>\s*<string>.*<\/string>/, `<key>CFBundleDisplayName</key>\n\t<string>${appInfo.app.name}</string>`],
  ]);

  applyIosUrlSchemes(appInfo);
  applyXcodeProject(appInfo);
}

function applyIosUrlSchemes(appInfo) {
  const infoPlistPath = path.join(appDir, 'ios/App/App/Info.plist');
  let content = fs.readFileSync(infoPlistPath, 'utf8');
  const schemes = Array.from(new Set([
    appInfo.app.urlScheme,
    ...(appInfo.socialLogin?.iosUrlSchemes ?? []),
  ]));
  const urlTypes = `\t<key>CFBundleURLTypes</key>
\t<array>
${schemes.map((scheme) => `\t\t<dict>
\t\t\t<key>CFBundleTypeRole</key>
\t\t\t<string>Editor</string>
\t\t\t<key>CFBundleURLName</key>
\t\t\t<string>${scheme}</string>
\t\t\t<key>CFBundleURLSchemes</key>
\t\t\t<array>
\t\t\t\t<string>${scheme}</string>
\t\t\t</array>
\t\t</dict>`).join('\n')}
\t</array>`;

  if (content.includes('<key>CFBundleURLTypes</key>')) {
    content = content.replace(/\t<key>CFBundleURLTypes<\/key>\s*\n\t<array>[\s\S]*?\n\t<\/array>/, urlTypes);
  } else {
    content = content.replace(/\t<key>CFBundleVersion<\/key>/, `${urlTypes}\n\t<key>CFBundleVersion</key>`);
  }

  fs.writeFileSync(infoPlistPath, content);
}

function applyXcodeProject(appInfo) {
  const projectPath = path.join(appDir, 'ios/App/App.xcodeproj/project.pbxproj');
  let content = fs.readFileSync(projectPath, 'utf8');

  content = content
    .replace(/INFOPLIST_KEY_CFBundleDisplayName = .*;/g, `INFOPLIST_KEY_CFBundleDisplayName = ${appInfo.app.name};`)
    .replace(/PRODUCT_BUNDLE_IDENTIFIER = .*;/g, `PRODUCT_BUNDLE_IDENTIFIER = ${appInfo.app.id};`);

  if (!content.includes('GoogleService-Info.plist')) {
    content = content
      .replace(
        '/* Begin PBXBuildFile section */',
        '/* Begin PBXBuildFile section */\n\t\t04304F8E2EB7519400554383 /* GoogleService-Info.plist in Resources */ = {isa = PBXBuildFile; fileRef = 04304F8D2EB7519400554383 /* GoogleService-Info.plist */; };',
      )
      .replace(
        '/* Begin PBXFileReference section */',
        '/* Begin PBXFileReference section */\n\t\t04304F8D2EB7519400554383 /* GoogleService-Info.plist */ = {isa = PBXFileReference; lastKnownFileType = text.plist.xml; path = "GoogleService-Info.plist"; sourceTree = "<group>"; };',
      )
      .replace(
        '50379B222058CBB4000EE86E /* capacitor.config.json */,',
        '50379B222058CBB4000EE86E /* capacitor.config.json */,\n\t\t\t\t04304F8D2EB7519400554383 /* GoogleService-Info.plist */,',
      )
      .replace(
        '504EC3121FED79650016851F /* LaunchScreen.storyboard in Resources */,',
        '504EC3121FED79650016851F /* LaunchScreen.storyboard in Resources */,\n\t\t\t\t04304F8E2EB7519400554383 /* GoogleService-Info.plist in Resources */,',
      );
  }

  fs.writeFileSync(projectPath, content);
}

function copyBrandAssets() {
  for (const publicDir of [
    path.join(appDir, 'public/brand'),
    path.join(rootDir, 'web/public/brand'),
  ]) {
    ensureDir(publicDir);

    for (const fileName of ['logo-color.png', 'logo-black.png', 'logo-white.png']) {
      copyFile(path.join(requiredDir, `brand/${fileName}`), path.join(publicDir, fileName));
    }
  }
}

function escapeJavaScriptString(value) {
  return value.replaceAll('\\', '\\\\').replaceAll("'", "\\'");
}

function writeBrandComponents(appInfo) {
  const altText = escapeJavaScriptString(`${appInfo.app.name} logo`);
  const componentSource = `import type { ImgHTMLAttributes } from 'react'

type BrandLogoVariant = 'black' | 'color' | 'white'

type BrandLogoProps = Omit<ImgHTMLAttributes<HTMLImageElement>, 'alt' | 'src'> & {
  alt?: string
  variant?: BrandLogoVariant
}

const brandLogoSources: Record<BrandLogoVariant, string> = {
  black: '/brand/logo-black.png',
  color: '/brand/logo-color.png',
  white: '/brand/logo-white.png',
}

export function BrandLogo({
  alt = '${altText}',
  variant = 'color',
  ...imageProps
}: BrandLogoProps): React.JSX.Element {
  return <img {...imageProps} alt={alt} src={brandLogoSources[variant]} />
}
`;

  const appComponentPath = path.join(appDir, 'src/components/brand/brand-logo.component.tsx');
  const webComponentPath = path.join(rootDir, 'web/src/components/brand-logo.component.tsx');

  ensureDir(path.dirname(appComponentPath));
  ensureDir(path.dirname(webComponentPath));
  fs.writeFileSync(appComponentPath, componentSource);
  fs.writeFileSync(webComponentPath, componentSource);
}

function prepareCapacitorAssets() {
  const assetsDir = path.join(appDir, 'assets');
  ensureDir(assetsDir);

  copyFile(path.join(requiredDir, 'brand/icon.png'), path.join(assetsDir, 'icon.png'));
  copyFile(path.join(requiredDir, 'brand/splash.png'), path.join(assetsDir, 'splash.png'));

  const splashDarkPath = path.join(requiredDir, 'brand/splash-dark.png');
  if (fs.existsSync(splashDarkPath)) {
    copyFile(splashDarkPath, path.join(assetsDir, 'splash-dark.png'));
  }
}

function runCapacitorAssets(appInfo) {
  const result = spawnSync(
    'pnpm',
    [
      'exec',
      'capacitor-assets',
      'generate',
      '--assetPath',
      'assets',
      '--iconBackgroundColor',
      appInfo.colors.background,
      '--iconBackgroundColorDark',
      appInfo.darkColors.background,
      '--splashBackgroundColor',
      appInfo.colors.background,
      '--splashBackgroundColorDark',
      appInfo.darkColors.background,
    ],
    {
      cwd: appDir,
      encoding: 'utf8',
      stdio: 'inherit',
    },
  );

  if (result.status) {
    throw new Error('capacitor-assets generation failed');
  }
}

async function generateNotificationIcons() {
  const sourcePath = path.join(requiredDir, 'brand/notification-icon.png');

  for (const [densityDir, size] of Object.entries(androidNotificationSizes)) {
    const targetPath = path.join(androidResDir, densityDir, 'ic_notif.png');
    ensureDir(path.dirname(targetPath));
    await sharp(sourcePath)
      .resize(size, size, {
        fit: 'contain',
        background: { alpha: 0, b: 0, g: 0, r: 0 },
      })
      .png()
      .toFile(targetPath);
  }
}

async function main() {
  assertRequiredFiles();

  const appInfo = readAppInfo();

  applyCapacitorConfig(appInfo);
  applyManifest(appInfo);
  applyIndexHtml(appInfo);
  writeAppCss(appInfo);
  writeWebCss(appInfo);
  applyAndroid(appInfo);
  applyIos(appInfo);
  copyBrandAssets();
  writeBrandComponents(appInfo);
  prepareCapacitorAssets();
  runCapacitorAssets(appInfo);
  await generateNotificationIcons();

  console.info('Applied .required app assets and configuration.');
}

main().catch((error) => {
  console.error(error instanceof Error ? error.message : error);
  process.exit(1);
});
