from django.contrib import admin
from .models import Post, Comment, Like  # Import the Post model

@admin.register(Post)
class PostAdmin(admin.ModelAdmin):
    list_display = ('user','title', 'category', 'created_at')  # Fields to display in admin list view
    search_fields = ('title', 'description')  # Enables search
    list_filter = ('category', 'created_at')  # Add filtering options

# Alternatively, without customization:
# admin.site.register(Post)
@admin.register(Comment)
class CommentAdmin(admin.ModelAdmin):
    list_display = ('id', 'user', 'post', 'content', 'created_at')
    list_filter = ('created_at', 'user')
    search_fields = ('user__username', 'post__title', 'content')
    ordering = ('-created_at',)
    
@admin.register(Like)
class LikeAdmin(admin.ModelAdmin):
    list_display = ('user', 'post', 'created_at')
    search_fields = ('user__username', 'post__title')
    list_filter = ('created_at',)