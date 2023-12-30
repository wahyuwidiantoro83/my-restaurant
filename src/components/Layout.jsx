import SideNav from "./SideNav";

const Layout = (props) => {
  return (
    <div className="flex h-screen w-[80%] m-auto">
      <SideNav />
      {props.children}
    </div>
  );
};

export default Layout;
