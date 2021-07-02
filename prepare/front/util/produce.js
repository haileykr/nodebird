import produce, {enableES5} from "immer";
//to support IE

export default (...args) => {
  enableES5();//adding functionality on top of produce
  return produce(...args);
}; //expanding produce