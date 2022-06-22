import { find, project } from "./util"

describe("util", () => {
  test("project", () => {
    expect(project({ a: 1, b: 2, c: 3 }, ["b", "c"])).toEqual({ b: 2, c: 3 })
  })
  test("find", () => {
    expect(
      find(
        [
          { a: 1, b: 2, c: 3 },
          { a: 1, b: 3, c: 4 },
          { a: 2, b: 3, c: 2 },
          { a: 3, b: 3, c: 1 },
        ],
        { a: 3, b: 3 }
      )
    ).toEqual({ a: 3, b: 3, c: 1 })
  })
  test("find", () => {
    expect(
      find(
        [
          { a: 1, b: 2, c: 3 },
          { a: 1, b: 3, c: 4 },
          { a: 2, b: 3, c: 2 },
          { a: 3, b: 3, c: 1 },
        ],
        { a: 1, b: 3 }
      )
    ).toEqual({ a: 1, b: 3, c: 4 })
  })
  test("find", () => {
    expect(
      find(
        [
          { a: 1, b: 2, c: 3 },
          { a: 1, b: 3, c: 4 },
          { a: 2, b: 3, c: 2 },
          { a: 3, b: 3, c: 1 },
        ],
        { a: 1, b: 2 }
      )
    ).toEqual({ a: 1, b: 2, c: 3 })
  })
  test("find", () => {
    expect(
      find(
        [
          { a: 1, b: 2, c: 3 },
          { a: 1, b: 3, c: 4 },
          { a: 2, b: 3, c: 2 },
          { a: 3, b: 3, c: 1 },
        ],
        { a: 1, b: 3 }
      )
    ).toEqual({ a: 1, b: 3, c: 4 })
  })
  test("find", () => {
    expect(
      find(
        [
          { a: 1, b: 2, c: 3 },
          { a: 1, b: 3, c: 4 },
          { a: 2, b: 3, c: 2 },
          { a: 3, b: 3, c: 1 },
        ],
        { a: 2 }
      )
    ).toEqual({ a: 2, b: 3, c: 2 })
  })
})
