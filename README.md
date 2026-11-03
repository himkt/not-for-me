# Not For Me

[![Tests](https://github.com/himkt/not-for-me/actions/workflows/test.yml/badge.svg)](https://github.com/himkt/not-for-me/actions/workflows/test.yml)

A Chrome and Safari extension that automatically removes the "For you" tab from X (formerly Twitter) and navigates to the "Following" tab. It also removes ads and trending sections for a cleaner browsing experience.

## Features

- ✅ Automatically hides the "For you" tab
- ✅ Automatically navigates to the "Following" tab
- ✅ Removes ads from the timeline
- ✅ Removes "Trends for you" and "What's happening" sections
- ✅ Works on both twitter.com and x.com domains
- ✅ Runs automatically when the page loads

### Planned Features

- Automatically navigate to the following tab when an internal transition occurs
- Support for custom timeline settings
- Configuration options to choose which elements to hide

## Installation

> [!NOTE]
> not-for-me is only available on GitHub. Please install manually.

1. Clone this repository or download the latest release
   ```
   git clone https://github.com/himkt/not-for-me.git
   ```
2. Build the extension
   ```
   pnpm install
   pnpm run build
   ```
3. Open Chrome and navigate to `chrome://extensions/`
4. Enable "Developer mode" by toggling the switch in the top right corner
5. Click "Load unpacked" and select the `dist` directory from this project
6. The extension is now installed and will automatically run when you visit X/Twitter

### Safari (macOS / iOS)

The Xcode project in `safari/` wraps the build output in `dist/` as a Safari Web Extension. Each extension target runs `safari/build-web-extension.sh`, which builds `dist/` with `pnpm`, so `pnpm` must be installed.

1. Open `safari/Not For Me/Not For Me.xcodeproj` in Xcode
2. Select your team under "Signing & Capabilities" for every target
3. Run the `Not For Me (macOS)` or `Not For Me (iOS)` scheme
4. Enable "Not For Me" in Safari's extension settings and allow it on x.com

## Development

### Prerequisites

- Node.js (v14 or later)
- pnpm (the version pinned in `packageManager` in `package.json`)

### Setup

1. Clone the repository
   ```
   git clone https://github.com/himkt/not-for-me.git
   cd not-for-me
   ```

2. Install dependencies
   ```
   pnpm install
   ```

3. Build the extension
   ```
   pnpm run build
   ```

4. For development with automatic rebuilding, use:
   ```
   pnpm run dev
   ```

### Testing

Run the test suite with:

```
pnpm test
```

## How It Works

The extension uses content scripts that run on X/Twitter pages to:

1. Hide the "For you" tab using DOM manipulation
2. Automatically click on the "Following" tab
3. Set up a MutationObserver to continuously monitor and remove unwanted elements
4. Hide advertisements and trending sections

## References

- [Chrome Extensions Getting Started Guide](https://developer.chrome.com/docs/extensions/get-started/tutorial/hello-world)
- [Content Scripts Documentation](https://developer.chrome.com/docs/extensions/develop/concepts/content-scripts)
- [Chrome Extension Development Guide (Japanese)](https://www2.kobe-u.ac.jp/~tnishida/programming/ChromeExtension-02.html)
