# Clippy Mc. Clipface

Simple, self hosted clip sharing application.

## Usage with Docker

First of all pull the Docker image:

```
$ docker pull tomsan/clipface
```

Very simple usage, no authentication, port 80:

```
docker run -d \
  --name clipface \
  -v /host/path/to/clips:/clips \
  -p 80:80 \
  tomsan/clipface:latest
```

For more advanced usage, you need to add a config file. Create the file
"clipface.toml" on your host machine and add the content from
[clipface.toml.example][1].

[1]: https://raw.githubusercontent.com/Hubro/clipface/master/client/clipface.example.toml

Map the config file to `/config/clipface.toml` inside the Docker container,
for example:

```
docker run -d \
  --name clipface \
  -v /host/path/to/clips:/clips \
  -v /host/path/to/clipface.toml:/config/clipface.toml \
  -p 80:80 \
  tomsan/clipface:latest
```

### Authentication

Clipface supports simple password authentication by setting the
`user_password` option in the config file. This will redirect users to a
login screen where the configured password must be entered before the user
can proceed.

For security reasons, the hashed password is stored in a HTTP-only cookie.
Clipface assumes (again for security reasons) that you will be running it
behind a reverse proxy with SSL enabled, so the "secure_cookies" config
option defaults to `true`. This means that the authentication cookie is
created with the "secure" flag, which means it will only be transferred when
the HTTPS protocol is used. If you are running Clipface without SSL, you
should set the "secure_cookies" option to `false` in the config file,
otherwise authentication will not work.

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

  - **(DONE)** "Cinema mode"

    Let the clip cover the entire width and/or height of the browser,
    instead of limiting the width. The preference should be saved in local
    storage.

  - **(DONE)** Make page title of clip list page configurable

    It's currently hard coded to "Tomsan clip folder", not really applicable
    for most people

- **(DONE)** Deploy Docker image to Docker Hub for easier deployment

- **(DONE)** Add usage instructions to this README!

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

- **(Maybe)** Add a clip length column to clip table

  This would be nice to have, but could be bad for application performance
  and require some kind of caching, we'll see. Can be done with ffprobe
  through for example the [node-ffprobe library][1].

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
