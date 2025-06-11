from rest_framework import generics, permissions, filters, status
from django.db.models import Count, OuterRef, Subquery, IntegerField
from .models import Post, Comment, Like
from .serializers import PostSerializer, CommentSerializer
from django_filters.rest_framework import DjangoFilterBackend
from rest_framework.response import Response

class PostCreateAPIView(generics.CreateAPIView):
    queryset = Post.objects.all()
    serializer_class = PostSerializer
    permission_classes = [permissions.IsAuthenticated]

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)

from django_filters.rest_framework import DjangoFilterBackend

class UserPostListView(generics.ListAPIView):
    serializer_class = PostSerializer
    permission_classes = [permissions.IsAuthenticated]
    filter_backends = [DjangoFilterBackend]
    filterset_fields = ['category']  # <-- enables ?category=Education

    def get_queryset(self):
        return Post.objects.filter(user=self.request.user).annotate(
            comments_count=Subquery(
                Comment.objects.filter(post=OuterRef('pk'))
                .order_by()
                .values('post')
                .annotate(count=Count('id'))
                .values('count')[:1],
                output_field=IntegerField()
            ),
            likes_count=Subquery(
                Like.objects.filter(post=OuterRef('pk'))
                .order_by()
                .values('post')
                .annotate(count=Count('id'))
                .values('count')[:1],
                output_field=IntegerField()
            )
        ).order_by('-created_at')


class PostUpdateAPIView(generics.RetrieveUpdateDestroyAPIView):
    serializer_class = PostSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return Post.objects.filter(user=self.request.user)

class AllPublicPostsAPIView(generics.ListAPIView):
    serializer_class = PostSerializer
    permission_classes = []  # public access
    
    filter_backends = [DjangoFilterBackend]
    filterset_fields = ['category']  # <-- enable filtering on category

    def get_queryset(self):
        return Post.objects.annotate(
            comments_count=Subquery(
                Comment.objects.filter(post=OuterRef('pk'))
                .order_by()
                .values('post')
                .annotate(count=Count('id'))
                .values('count')[:1],
                output_field=IntegerField()
            ),
            likes_count=Subquery(
                Like.objects.filter(post=OuterRef('pk'))
                .order_by()
                .values('post')
                .annotate(count=Count('id'))
                .values('count')[:1],
                output_field=IntegerField()
            )
        ).order_by('-created_at')

class PostDetailAPIView(generics.RetrieveAPIView):
    queryset = Post.objects.all()
    serializer_class = PostSerializer
    
    def get_serializer_context(self):
        context = super().get_serializer_context()
        context['request'] = self.request  # ensure request is passed to serializer
        return context

class CommentCreateAPIView(generics.ListCreateAPIView):
    serializer_class = CommentSerializer

    def get_permissions(self):
        if self.request.method == 'POST':
            return [permissions.IsAuthenticated()]
        return [permissions.AllowAny()]

    def get_queryset(self):
        post_id = self.kwargs['post_id']
        return Comment.objects.filter(post_id=post_id).order_by('-created_at')

    def perform_create(self, serializer):
        serializer.save(user=self.request.user, post_id=self.kwargs['post_id'])

class PostSearchAPIView(generics.ListAPIView):
    serializer_class = PostSerializer
    permission_classes = []

    filter_backends = [filters.SearchFilter, DjangoFilterBackend]
    search_fields = ['title', 'category', 'description']

    def get_queryset(self):
        return Post.objects.annotate(
            comments_count=Subquery(
                Comment.objects.filter(post=OuterRef('pk'))
                .order_by()
                .values('post')
                .annotate(count=Count('id'))
                .values('count')[:1],
                output_field=IntegerField()
            ),
            likes_count=Subquery(
                Like.objects.filter(post=OuterRef('pk'))
                .order_by()
                .values('post')
                .annotate(count=Count('id'))
                .values('count')[:1],
                output_field=IntegerField()
            )
        ).order_by('-created_at')

class ToggleLikeAPIView(generics.GenericAPIView):
    permission_classes = [permissions.IsAuthenticated]
    queryset = Post.objects.all()

    def post(self, request, *args, **kwargs):
        post = self.get_object()
        user = request.user

        like_obj, created = Like.objects.get_or_create(user=user, post=post)

        if not created:
            like_obj.delete()
            liked = False
        else:
            liked = True

        likes_count = post.likes.count()

        return Response({'liked': liked, 'likes_count': likes_count}, status=status.HTTP_200_OK)

