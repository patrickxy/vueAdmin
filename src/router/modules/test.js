/** When your routing table is too long, you can split it into small modules **/

import Layout from "@/layout";

const testRouter = {
  path: "/test",
  component: Layout,
  redirect: "/test/test1",
  name: "Test",
  meta: {
    title: "Test",
    icon: "table",
    roles: ["admin"]
  },
  children: [
    {
      path: "test1",
      component: () => import("@/views/table/dynamic-table/index"),
      name: "test1",
      meta: { title: "test1" }
    },
    {
      path: "test2",
      component: () => import("@/views/table/drag-table"),
      name: "test2",
      meta: { title: "test2" }
    }
  ]
};
export default testRouter;
