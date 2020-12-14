# Clippy Mc. Clipface

Simple, self hosted clip sharing application.

## Roadmap

### Version 1.0

- **(DONE)** Config file

  Some upcoming features will require configuration, so Clipface needs to be
  able to load information from a config file and make it available to both
  the front-end and back-end of the application.

- **(DONE)** Authentication

  The ability to password protect the application. This should be a simple
  password popup.

- User interface improvements

  - **(DONE)** Copy link to clip

    Should be available both in the clip viewer and the clip list

  - **(DONE)** Clip searching

    A filter box at the top of the clip list should filter out any clips
    that don't match the input.

  - "Cinema mode"

    Let the clip cover the entire width and/or height of the browser,
    instead of limiting the width. The preference should be saved in local
    storage.

  - Make page title of clip list page configurable

    It's currently hard coded to "Tomsan clip folder", not really applicable
    for most people

- **(Maybe)** Add a clip length column to clip table

  This would be nice to have, but could be bad for application performance
  and require some kind of caching, we'll see. Can be done with ffprobe
  through for example the [node-ffprobe library][1].

### Version 2.0

- Admin authentication

  This should work just like the regular authentication, but grant admin
  privileges.

- Admin actions - Should be available only while authenticated as admin

  - Upload clip (with drag-and-drop)
  - Rename clip
  - Delete clip

- Clip metadata - Should be editable while authenticated as admin
  - Clip title
  - Clip description
  - Cached clip length?

## Authentication

Clipface is not a banking application, the authentication scheme does not
need to be military grade and super powerful. I'm thinking it should be
enough to put a password in the config file, and upon login, check if the
password matches the one in the config file. If yes, save a hashed and
salted version of the password in a secure cookie. On every request, check
that the password in the cookie matches the one in the config file.

The salting and hashing is just to keep the original password from being
recovered from the cookie by a malevolent actor, in case it's a password
that is reused somewhere else.

[1]: https://github.com/ListenerApproved/node-ffprobe
