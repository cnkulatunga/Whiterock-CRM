from rest_framework.response import Response


def paginate_queryset(qs, request, serializer_class, page_size=20):
    """Simple cursor-free pagination for MongoEngine querysets."""
    try:
        page = max(1, int(request.query_params.get('page', 1)))
    except (ValueError, TypeError):
        page = 1

    page_size = int(request.query_params.get('page_size', page_size))
    page_size = min(page_size, 100)

    total  = qs.count()
    offset = (page - 1) * page_size
    items  = list(qs.skip(offset).limit(page_size))

    return Response({
        'count':    total,
        'page':     page,
        'pages':    (total + page_size - 1) // page_size,
        'next':     page + 1 if offset + page_size < total else None,
        'previous': page - 1 if page > 1 else None,
        'results':  serializer_class(items, many=True).data,
    })
