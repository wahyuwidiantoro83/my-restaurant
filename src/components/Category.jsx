const Category = (props) => {
  return (
    <div
      className={`group flex flex-col gap-3 w-24 h-full shadow-sm p-3 rounded-xl  ${
        props.selected ? "bg-blue-500" : "bg-white"
      }  cursor-pointer hover:bg-blue-500 transition-all duration-200`}
      onClick={props.click}
    >
      <div className="div aspect-square w-full rounded-xl overflow-hidden bg-white">
        <img
          className="w-full h-full object-cover"
          src={`http://localhost:3333/public/category/${props.value.image}`}
          alt=""
        />
      </div>
      <span
        className={`text-center text-sm line-clamp-1 group-hover:font-bold group-hover:text-white ${
          props.selected ? "text-white font-bold" : " text-gray-500"
        }`}
      >
        {props.value.category}
      </span>
    </div>
  );
};

export default Category;
