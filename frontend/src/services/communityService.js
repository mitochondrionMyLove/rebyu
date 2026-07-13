import { base } from "./base"

const postView = (post) => ({
  ...post,
  badge: post.ownedByMe ? "You" : "Learner",
  badgeClass: "border-blue-200 bg-blue-50 text-blue-700",
  community: post.community || "Community",
  createdAt: new Intl.RelativeTimeFormat("en", { numeric: "auto" }).format(
    -Math.max(0, Math.round((Date.now() - new Date(post.createdAt).getTime()) / 3600000)), "hour"
  ),
  attachment: post.attachmentName ? {
    name: post.attachmentName,
    type: post.attachmentType || "PDF",
    meta: "Community resource",
  } : null,
})

export const getCommunityPosts = async () => (await base("community/posts")).map(postView)
export const getCommunityCircles = () => base("community/circles")
export const createCommunityPost = async (payload) => postView(await base("community/posts", { method: "POST", data: payload }))
export const createCommunityCircle = (payload) => base("community/circles", { method: "POST", data: payload })
export const toggleCommunityLike = (id) => base(`community/posts/${id}/like`, { method: "POST" })
export const toggleCommunitySave = (id) => base(`community/posts/${id}/save`, { method: "POST" })
export const toggleCircleMembership = (id) => base(`community/circles/${id}/membership`, { method: "POST" })
export const getCommunityComments = (id) => base(`community/posts/${id}/comments`)
export const addCommunityComment = (id, body, parentCommentId = null) => base(`community/posts/${id}/comments`, { method: "POST", data: { body, parentCommentId } })
export const deleteCommunityPost = (id) => base(`community/posts/${id}`, { method: "DELETE" })
