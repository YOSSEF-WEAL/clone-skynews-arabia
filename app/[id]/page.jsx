import { redirect } from "next/navigation";
import apiGetPostById from "../_apis/apiGetPostById";

export default async function PostById({ params }) {
  const { id } = await params;
  const post = await apiGetPostById(id);

  if (!post?.slug) return <div>Post not found</div>;

  redirect(`/${id}/${post.slug}`);
}
