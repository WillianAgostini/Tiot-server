let x = [
  {
    _id: "5e14debecf68827f43ad5b92",
    name: "x10",
    createBy: "5e14ab459f1b94575d70e2dc",
    __v: 0,
    createDate: "2020-01-08T00:56:12.776Z"
  },
  {
    _id: "5e1523ce9b22f813a621998a",
    name: "21",
    createBy: "5e14ab459f1b94575d70e2dc",
    createDate: "2020-01-08T00:35:26.888Z",
    __v: 0
  },
  {
    _id: "5e1524d19b22f813a621998b",
    name: "sadfasdf",
    createBy: "5e14ab459f1b94575d70e2dc",
    createDate: "2020-01-08T00:39:45.158Z",
    __v: 0
  },
  {
    _id: "5e1528499b22f813a621998c",
    name: "yo",
    createBy: "5e14ab459f1b94575d70e2dc",
    createDate: "2020-01-08T00:54:33.692Z",
    __v: 0
  }
];

function removeById(arr, id) {
  return arr.filter(function name(value) {
    if (value._id != id) return value;
  });
}

let z = "5e1528499b22f813a621998c";
let filtered = removeById(x, z);

console.log(filtered);
