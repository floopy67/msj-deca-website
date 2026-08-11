# MSJ DECA website

This is a static, multi-page website designed for GitHub Pages. Public chapter information is written directly into the HTML. Firebase Authentication and Firestore protect the member resource library, event quiz, and officer admin tools.

## Folder structure

```text
msj-deca-site/
├── images/
│   ├── chapter-placeholder.svg
│   └── person-placeholder.svg
├── pages/
│   ├── admin.html
│   ├── dlt.html
│   ├── dmt.html
│   ├── faq.html
│   ├── login.html
│   ├── mission.html
│   ├── officers.html
│   ├── programs.html
│   ├── quiz.html
│   └── resources.html
├── admin.js
├── auth.js
├── firebase-config.js
├── firestore.rules
├── index.html
├── login.js
├── quiz.js
├── resources.js
├── script.js
└── style.css
```

## 1. Preview the public design locally

Because Firebase uses JavaScript modules, do not double-click `index.html`. Open the folder in VS Code, install the Live Server extension, and click **Go Live**. The public pages and design will work immediately. Firebase pages will work after the setup below.

## 2. Create the Firebase project

1. Go to [Firebase Console](https://console.firebase.google.com/), choose **Create a project**, and name it something like `msj-deca`.
2. On the project overview, choose **Add app** → **Web** (`</>`).
3. Register the app. Firebase will show a `firebaseConfig` object.
4. Open `firebase-config.js` and replace every `PASTE_...` placeholder with the matching value. Do not add quotation marks inside the values; the file already includes them.

Firebase web configuration values are public identifiers. The Firestore rules included in this project provide the actual data protection.

## 3. Enable school Google sign-in

1. In Firebase, open **Authentication** → **Get started**.
2. Under **Sign-in method**, enable **Google**.
3. Choose the chapter/advisor support email requested by Firebase and save.
4. Open **Authentication** → **Settings** → **Authorized domains**.
5. Add the domain where the site will run:
   - Local testing normally uses `localhost`.
   - For GitHub Pages, add `YOUR-USERNAME.github.io` (for example, `floopy67.github.io`).
   - Add a custom domain later if the chapter receives one.

The site requests `@fusdk12.net` accounts, checks the domain after sign-in, and Firestore checks it again before returning protected data.

If the district Google Workspace blocks the sign-in, ask the school technology administrator to approve the Firebase Google OAuth app. Do not replace the domain checks with a shared password.

## 4. Create Firestore and install the rules

1. Open **Firestore Database** → **Create database**.
2. Choose a production location near your users. Do not start in unrestricted test mode for a published site.
3. Open the **Rules** tab.
4. Copy all of `firestore.rules`, paste it into the Firebase Rules editor, and click **Publish**.

These rules allow:

- verified `@fusdk12.net` users to read resources;
- approved officer accounts to create, edit, and delete resources;
- nobody to edit the officer list from the website.

## 5. Give each officer admin access

Each officer signs in with their own school Google account.

1. Have the officer sign in to the website once.
2. In Firebase, open **Authentication** → **Users** and copy that officer’s **User UID**.
3. Open **Firestore Database** → **Data**.
4. Create a collection named exactly `admins`.
5. Create a document whose **Document ID is the officer’s User UID**.
6. Add these fields:

| Field | Type | Example |
|---|---|---|
| `active` | Boolean | `true` |
| `email` | String | `officer@fusdk12.net` |
| `name` | String | `Officer Name` |

Repeat this for each officer. To remove access without deleting history, change `active` to `false`.

## 6. Prepare the school-restricted Drive folder

1. Create a Google Drive folder owned by a stable chapter or advisor account—not a graduating student’s personal account.
2. Open **Share** and restrict access to the school organization/domain. Do not select **Anyone with the link**.
3. Give editing access only to the officers who maintain resources.
4. Place resource files inside this folder and copy their Drive links.
5. Officers can sign in at `pages/admin.html` and publish the title, category, description, and Drive link.

Firebase protects the resource listing. Google Drive independently protects the underlying file if a link is copied or shared.

## 7. Replace placeholder content

- Replace `images/chapter-placeholder.svg` with a chapter photo and update the filename in `index.html`, or overwrite the placeholder with a file of the same name.
- Replace `images/person-placeholder.svg` references on the officers, DLT, and DMT pages with individual portrait filenames.
- Search the project for the words `Replace`, `Add`, `Officer Name`, and `Member Name` to find unfinished content.
- Update homepage dates and events directly in `index.html`.
- Replace `#` placeholder links on `pages/programs.html` before publishing.
- Confirm that you have permission to publish every student’s name, photograph, and biography.

## 8. Push to GitHub Pages

Put the **contents** of this folder at the root of the website repository, so `index.html` is at the repository root. Commit and push the files, then open the repository’s **Settings** → **Pages** and publish from the `main` branch/root folder.

After GitHub Pages gives you the final URL, return to Firebase Authentication and confirm that its domain is listed under **Authorized domains**.

## Security notes

- A navigation link being hidden is not security. Firestore Security Rules and Drive sharing settings are the security boundaries.
- Do not store confidential information in public HTML, JavaScript comments, or the GitHub repository.
- Never put service-account keys, private keys, or administrator passwords into this project.
- Review the Firebase Authentication user list and `admins` collection when officers graduate or leave their roles.
- Test with one approved school account, one non-admin school account, and one personal Gmail account before launch.

## Editing the quiz

Quiz questions, options, cluster descriptions, and suggested events are in `quiz.js`. The quiz is intended as a starting point; verify event names and availability against the current DECA guide each year.
