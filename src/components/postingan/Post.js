import React from "react";
import { useState, useEffect } from "react";
import moment from "moment";
import {
  FaRegComment,
  FaRegHeart,
  FaHeart,
  FaRegBookmark,
  FaBookmark,
  FaEllipsisH,
} from "react-icons/fa";
import { MdDelete } from "react-icons/md";
import { pathFile } from "../../constants";
import {
  Menu,
  useDisclosure,
  MenuButton,
  useToast,
  MenuList,
  MenuItem,
  Avatar,
} from "@chakra-ui/react";
import { Link } from "react-router-dom";
import DeleteModal from "./DeleteModal";
import DeleteCommentModal from "./DeleteCommentModal";
import auth from "../../store/Auth";
import API from "../../services";

const ReadMore = ({ children }) => {
  const text = children;
  const [isReadMore, setIsReadMore] = useState(true);
  const [colorHover, setColorHover] = useState("font-semibold");
  const toggleReadMore = () => {
    setIsReadMore(!isReadMore);
  };
  const hover = () => {
    colorHover === "font-semibold"
      ? setColorHover("font-bold")
      : setColorHover("font-semibold");
  };
  return (
    <p className="text">
      {isReadMore ? text.slice(0, 150) : text}
      <span
        onClick={toggleReadMore}
        onMouseEnter={hover}
        className={colorHover}
      >
        {isReadMore ? "...read more" : " show less"}
      </span>
    </p>
  );
};

// const Menu = () => {
//   return (
//     <div className="shadow border border-slate-200 mx-1 px-2 rounded-md text-sm">
//       Delete Post
//     </div>
//   );
// };

const Comment = ({ profilePic, name, idPost }) => {
  const user = auth((state) => state.user);
  const toast = useToast();
  const { isOpen, onOpen, onClose } = useDisclosure();

  const [idComment, setIdComment] = useState();
  const [comment, setComment] = useState();
  const [comments, setComments] = useState([]);

  const getData = async () => {
    try {
      const res = await API.getComments({ page: 1, limit: 10, idPost });
      console.log(res.data);

      setComments(res.data.data);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getData();
  }, []);

  const onSubmit = async (e) => {
    e.preventDefault();
    console.log(comment);
    try {
      if (!comment) return;
      const res = await API.createComment({ comment, idPost, idUser: user.id });
      console.log(res.data);
      setComments((prev) => [...prev, res.data.data]);
      toast({
        title: "Create Comment success",
        status: "success",
        duration: 6000,
        isClosable: true,
        position: "bottom-right",
      });
      setComment("");
    } catch (error) {
      console.log(error);
      toast({
        title: "Create comment failed",
        description: "Something went wrong...",
        status: "error",
        duration: 6000,
        isClosable: true,
        position: "bottom-right",
      });
    }
  };
  return (
    <div className="comment">
      <DeleteCommentModal
        setData={setComments}
        id={idComment}
        isOpen={isOpen}
        onClose={onClose}
      />
      <div class="flex flex-col gap-2">
        {comments &&
          comments.map((val) => (
            <div class="flex items-center justify-between max-h-[250px] overflow-auto">
              <div className="flex">
                <Avatar
                  height="40px"
                  width="40px"
                  src={
                    val.user.profilePic ? pathFile + val.user.profilePic : ""
                  }
                />
                <div className="flex flex-col ml-3">
                  <div class="flex items-center">
                    <h5 className="font-semibold">{val.user.name}</h5>{" "}
                    <p className="ml-2 text-xs text-slate-400">
                      {moment(val.createdAt).fromNow()}
                    </p>
                  </div>
                  <p>{val.comment}</p>
                </div>
              </div>
              {user.id === val.idUser && (
                <button
                  type="button"
                  onClick={() => {
                    onOpen();
                    setIdComment(val.id);
                  }}
                  className="shrink-0 rounded-full h-9 w-9 bg-gray-100 flex items-center justify-center hover:bg-red-500 hover:text-white transition-all"
                >
                  <MdDelete />
                </button>
              )}
            </div>
          ))}
      </div>
      <form onSubmit={onSubmit} className="flex mt-2">
        <Avatar
          height="40px"
          width="40px"
          src={user.profilePic ? pathFile + user.profilePic : ""}
        />
        <input
          type="text"
          className="ml-2 w-full  h-[40px] bg-gray-100 rounded-full outline-none px-3"
          placeholder="Tulis komentar..."
          value={comment}
          onChange={(e) => setComment(e.target.value)}
        />
      </form>
    </div>
  );
};

const Post = (props) => {
  const {
    onOpen,
    setIdPost,
    id,
    materi,
    caption,
    createdAt,
    isLiked,
    isSaved,
    jumlahLike,
    idUser,
    jumlahComment,
  } = props;
  const user = auth((state) => state.user);

  const [like, setLike] = useState(isLiked);
  const [likeCount, setLikeCount] = useState(jumlahLike);
  const [commentCount, setCommentCount] = useState(jumlahComment);
  const [showComment, setShowComment] = useState(false);
  const [bookmark, setBookmark] = useState(isSaved);

  const handleLike = async () => {
    try {
      setLikeCount((prev) => (like ? prev - 1 : prev + 1));
      setLike((prev) => !prev);
      if (like) {
        await API.unlikePost({ idUser: user.id, idPost: id });
      } else {
        await API.likePost({ idUser: user.id, idPost: id });
      }
    } catch (error) {
      console.log(error);
      console.log(error.respond.data.message);
    }
  };
  const handleSave = async () => {
    try {
      setBookmark((prev) => !prev);

      if (bookmark) {
        await API.unsavePost({ idUser: user.id, idPost: id });
      } else {
        await API.savePost({ idUser: user.id, idPost: id });
      }
    } catch (error) {
      console.log(error);
      console.log(error.respond.data.message);
    }
  };
  const actionFooter = (
    <div className="flex items-center pt-2">
      <div className="flex flex-1 items-center">
        <button className="flex items-center" onClick={handleLike}>
          {like ? <FaHeart className="text-red-600" /> : <FaRegHeart />}{" "}
          <span className="mx-1"> {likeCount} </span>
        </button>
        <button
          className="flex items-center ml-1"
          onClick={() => setShowComment((prev) => !prev)}
        >
          <FaRegComment /> <span className="mx-1"> {commentCount} </span>
        </button>
      </div>
      <button onClick={handleSave}>
        {bookmark ? <FaBookmark /> : <FaRegBookmark />}
      </button>
    </div>
  );
  return (
    <div className="w-[100%] h-fit px-3 py-3 bg-white rounded-xl">
      {/* <DeleteModal
        setData={setData}
        id={id}
        isOpen={isOpen}
        onClose={onClose}
      /> */}
      <div className="flex items-center">
        <Avatar
          height="40px"
          width="40px"
          src={props.user.profilePic ? pathFile + props.user.profilePic : ""}
        />
        <div className="flex-1 ml-2">
          <Link
            to={`/${idUser}/posts`}
            className="hover:text-blue-500 transition-all font-semibold"
          >
            {props.user.name}
          </Link>
          <p className="text-xs text-slate-400">
            {moment(createdAt).fromNow()}
          </p>
        </div>
        {user.id === props.idUser && (
          <Menu>
            <MenuButton>
              <FaEllipsisH />
            </MenuButton>
            <MenuList w={50}>
              <MenuItem p={0}>
                <div
                  onClick={() => {
                    onOpen();
                    setIdPost(id);
                  }}
                  className="py-2 px-4 w-full transition-all hover:bg-gray-100 cursor-pointer"
                >
                  Delete Post
                </div>
              </MenuItem>
            </MenuList>
          </Menu>
        )}
        {/* <button onClick={() => setMenu(!menu)}>
          <FaEllipsisH />
        </button> */}
      </div>
      {materi !== "" && (
        <div className="post pt-3">
          <img src={pathFile + materi} className="w-full" alt="img-post" />
        </div>
      )}
      {materi !== "" && actionFooter}
      <div className="caption overflow-y-auto mt-1">
        {/* <ReadMore>{caption}</ReadMore> */}
        <p>{caption}</p>
      </div>
      {materi === "" && actionFooter}

      <div className="comment overflow-y-auto mt-2">
        {showComment ? (
          <Comment idPost={id} profilePic={props.user.profilePic} />
        ) : (
          ""
        )}
      </div>
    </div>
  );
};

export default Post;
