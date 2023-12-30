const Product = (props) => {
  return (
    <div
      className="group flex flex-col w-36 h-52 rounded-xl hover:bg-blue-500 hover:-translate-y-1 transition-all duration-200 overflow-hidden cursor-pointer shadow-sm bg-white"
      onClick={props.click}
    >
      <div className="w-full h-28 bg-white">
        <img
          className="w-full h-full object-cover"
          src={`http://localhost:3333/public/product/${props.value.image}`}
          alt=""
        />
      </div>
      <div className="detail flex flex-col w-full gap-1 items-center p-3 ">
        <span className="text-sm text-gray-800 font-bold group-hover:text-white line-clamp-1">
          {props.value.productName}
        </span>
        <span className="text-xs text-gray-500 group-hover:text-white">
          {props.value.category.category}
        </span>
        <span className="text-sm font-light text-gray-800 group-hover:text-white">
          {props.value.price.toLocaleString("id", { style: "currency", currency: "idr" })}
        </span>
      </div>
    </div>
  );
};

export default Product;
