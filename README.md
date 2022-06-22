# picsome

## Get started

Make sure the following ports are available:

- 3000
- 8080
- 9228

### Development

- Install blitz `npm install -g blitz --legacy-peer-deps`
- Run `cp .env.example .env` and change variables accordingly
- Run `docker-compose up`
- cd to `./app`
- run `npm install`
- run `blitz prisma init`
- run `blitz dev`

### Migration & Seeding

- Run `blitz prisma migrate dev && blitz db seed`

---

software for the good - konek.to
