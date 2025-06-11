from django.urls import path
from .views import PostCreateAPIView, UserPostListView , PostUpdateAPIView, AllPublicPostsAPIView, PostDetailAPIView,CommentCreateAPIView, PostSearchAPIView, ToggleLikeAPIView

urlpatterns = [
    path('', PostCreateAPIView.as_view(), name='create-post'),
    path('posts/', UserPostListView.as_view(), name='user-posts'),
    path('posts/<int:pk>/', PostUpdateAPIView.as_view(), name='update-post'),
    path('all-posts/', AllPublicPostsAPIView.as_view(), name='all-posts'),
    path('post/<int:pk>/', PostDetailAPIView.as_view(), name='post-detail'),
    path('comments/<int:post_id>/', CommentCreateAPIView.as_view(), name='comments'),
    # path('comments/create/', CommentCreateAPIView.as_view(), name='create-comment'),
    path('posts/search/', PostSearchAPIView.as_view(), name='post-search'),
    path('posts/<int:pk>/toggle-like/', ToggleLikeAPIView.as_view(), name='toggle-like'), 
]
