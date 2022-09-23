# picsome

Source code for [picsome.org](https://picsome.org/).

## The best collection of freely licensed images on the net

picsome is a project of [Wikimedia Deutschland e. V.](https://www.wikimedia.de/) The application is intended to be the technical successor of our [Attribution Generator](https://lizenzhinweisgenerator.de/?lang=en). We want to make the functionalities contained in the Attribution Generator available on a larger scale and, for example, also usable for images from other repositories. In addition, we have integrated areas for collecting and managing images as well as for sharing and searching in own or publicly shared collections. In this way, picsome will become the place to go for freely licensed, high-quality images that can be used in a license-compliant way.

We invite everyone to join us and work collaboratively to collect and curate this content. This is how we can gather an attractive collection of free and high quality content that offers a usable solution for many users and has the potential to save us all a lot of work during the next image search.

## Development

### Initial setup

- Make sure the ports 3000, 8080 and 9228 are available.
- Have [Docker](https://www.docker.com/get-started/) and docker-compose installed.
- Have [Node.js](https://nodejs.org/en/) installed and use the same version as mentioned in `.nvmrc`.
- Clone the repository and change directory into it.

  ```bash
  git clone git@github.com:wmde/picsome.git
  cd picsome
  ```
- Install the [Blitz.js](https://blitzjs.com/) CLI and project dependencies.

  ```bash
  npm install -g blitz --legacy-peer-deps
  npm install
  ```

- Create a `.env.local` from the template.

  ```bash
  cp .env.example .env.local
  ```

- Start the Docker containers for Postgres and the Attribution Generator API.

  ```bash
  docker-compose up -d
  ```

- Init the project database.

  ```
  blitz prisma init
  blitz dev
  ```

### Creation of database migrations

- Apply changes to `db/schema.prisma`
- Create migration. This adds a file to `db/migrations/` to recreate the changes you applied to the database for other users and during deployment.

  ```bash
  blitz prisma migrate dev
  ```

## Troubleshooting

- Error message “libc.musl-x86_64.so.1: cannot open shared object file: No such file or directory”

  Resolve this issue by running the following commands:

  ```bash
  apt-get install musl-dev
  ln -s /usr/lib/x86_64-linux-musl/libc.so /lib/libc.musl-x86_64.so.1
  ```

## License

BSD 3-Clause License (see [LICENSE.txt](LICENSE.txt))

---

software for the good - [konek.to](https://konek.to)
