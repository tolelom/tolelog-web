// 생성된 파일이다. 손으로 고치지 말고 npm run contract:types 로 다시 만든다.
// 원본: api-contract/swagger.json (tolelog-api 의 docs/swagger.json)

export interface paths {
    "/auth/login": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        /**
         * 로그인
         * @description 사용자명과 비밀번호로 로그인합니다
         */
        post: {
            parameters: {
                query?: never;
                header?: never;
                path?: never;
                cookie?: never;
            };
            /** @description 로그인 정보 */
            requestBody: {
                content: {
                    "application/json": components["schemas"]["dto.LoginRequest"];
                };
            };
            responses: {
                /** @description OK */
                200: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": components["schemas"]["dto.SuccessResponse"] & {
                            data?: components["schemas"]["dto.AuthDataResponse"];
                        };
                    };
                };
                /** @description Bad Request */
                400: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": components["schemas"]["dto.ErrorResponse"];
                    };
                };
                /** @description Unauthorized */
                401: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": components["schemas"]["dto.ErrorResponse"];
                    };
                };
                /** @description Internal Server Error */
                500: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": components["schemas"]["dto.ErrorResponse"];
                    };
                };
            };
        };
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/auth/logout": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        /**
         * 로그아웃
         * @description 리프레시 토큰을 무효화합니다
         */
        post: {
            parameters: {
                query?: never;
                header?: never;
                path?: never;
                cookie?: never;
            };
            requestBody?: never;
            responses: {
                /** @description OK */
                200: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": components["schemas"]["dto.SuccessResponse"] & {
                            data?: components["schemas"]["dto.MessageResponse"];
                        };
                    };
                };
                /** @description Unauthorized */
                401: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": components["schemas"]["dto.ErrorResponse"];
                    };
                };
                /** @description Internal Server Error */
                500: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": components["schemas"]["dto.ErrorResponse"];
                    };
                };
            };
        };
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/auth/refresh": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        /**
         * 토큰 갱신
         * @description 리프레시 토큰으로 새로운 액세스 토큰과 리프레시 토큰을 발급합니다
         */
        post: {
            parameters: {
                query?: never;
                header?: never;
                path?: never;
                cookie?: never;
            };
            /** @description 리프레시 토큰 */
            requestBody: {
                content: {
                    "application/json": components["schemas"]["dto.RefreshTokenRequest"];
                };
            };
            responses: {
                /** @description OK */
                200: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": components["schemas"]["dto.SuccessResponse"] & {
                            data?: components["schemas"]["dto.AuthDataResponse"];
                        };
                    };
                };
                /** @description Bad Request */
                400: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": components["schemas"]["dto.ErrorResponse"];
                    };
                };
                /** @description Unauthorized */
                401: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": components["schemas"]["dto.ErrorResponse"];
                    };
                };
                /** @description Internal Server Error */
                500: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": components["schemas"]["dto.ErrorResponse"];
                    };
                };
            };
        };
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/auth/register": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        /**
         * 회원가입
         * @description 새로운 사용자를 등록합니다
         */
        post: {
            parameters: {
                query?: never;
                header?: never;
                path?: never;
                cookie?: never;
            };
            /** @description 회원가입 정보 */
            requestBody: {
                content: {
                    "application/json": components["schemas"]["dto.RegisterRequest"];
                };
            };
            responses: {
                /** @description Created */
                201: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": components["schemas"]["dto.SuccessResponse"] & {
                            data?: components["schemas"]["dto.AuthDataResponse"];
                        };
                    };
                };
                /** @description Bad Request */
                400: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": components["schemas"]["dto.ErrorResponse"];
                    };
                };
                /** @description Conflict */
                409: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": components["schemas"]["dto.ErrorResponse"];
                    };
                };
                /** @description Internal Server Error */
                500: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": components["schemas"]["dto.ErrorResponse"];
                    };
                };
            };
        };
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/drafts": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /**
         * 내 초안 목록 조회
         * @description 현재 로그인한 사용자의 초안 글 목록을 조회합니다
         */
        get: {
            parameters: {
                query?: never;
                header?: never;
                path?: never;
                cookie?: never;
            };
            requestBody?: never;
            responses: {
                /** @description OK */
                200: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": components["schemas"]["dto.SuccessResponse"] & {
                            data?: components["schemas"]["dto.PostListResponse"][];
                        };
                    };
                };
                /** @description Unauthorized */
                401: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": components["schemas"]["dto.ErrorResponse"];
                    };
                };
                /** @description Internal Server Error */
                500: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": components["schemas"]["dto.ErrorResponse"];
                    };
                };
            };
        };
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/posts": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /**
         * 공개 글 목록 조회
         * @description 공개된 모든 글을 페이지네이션으로 조회합니다
         */
        get: {
            parameters: {
                query?: {
                    /** @description 페이지 번호 (기본값: 1) */
                    page?: number;
                    /** @description 페이지 크기 (기본값: 10) */
                    page_size?: number;
                    /** @description 태그 이름으로 거르기 */
                    tag?: string;
                };
                header?: never;
                path?: never;
                cookie?: never;
            };
            requestBody?: never;
            responses: {
                /** @description OK */
                200: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": components["schemas"]["dto.SuccessResponse"] & {
                            data?: components["schemas"]["dto.PostListWithPagination"];
                        };
                    };
                };
                /** @description Internal Server Error */
                500: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": components["schemas"]["dto.ErrorResponse"];
                    };
                };
            };
        };
        put?: never;
        /**
         * 새 글 생성
         * @description 사용자가 새로운 글을 작성합니다
         */
        post: {
            parameters: {
                query?: never;
                header: {
                    /** @description Bearer token */
                    Authorization: string;
                };
                path?: never;
                cookie?: never;
            };
            /** @description 글 내용 */
            requestBody: {
                content: {
                    "application/json": components["schemas"]["dto.CreatePostRequest"];
                };
            };
            responses: {
                /** @description Created */
                201: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": components["schemas"]["dto.SuccessResponse"] & {
                            data?: components["schemas"]["dto.PostResponse"];
                        };
                    };
                };
                /** @description Bad Request */
                400: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": components["schemas"]["dto.ErrorResponse"];
                    };
                };
                /** @description Unauthorized */
                401: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": components["schemas"]["dto.ErrorResponse"];
                    };
                };
                /** @description Internal Server Error */
                500: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": components["schemas"]["dto.ErrorResponse"];
                    };
                };
            };
        };
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/posts/{id}": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /**
         * 글 상세 조회
         * @description ID로 글을 조회합니다. 공개 글은 누구나, 비공개 글은 작성자만 조회 가능합니다.
         */
        get: {
            parameters: {
                query?: never;
                header?: {
                    /** @description Bearer token (비공개 글 조회 시 필요) */
                    Authorization?: string;
                };
                path: {
                    /** @description 글 ID */
                    id: number;
                };
                cookie?: never;
            };
            requestBody?: never;
            responses: {
                /** @description OK */
                200: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": components["schemas"]["dto.SuccessResponse"] & {
                            data?: components["schemas"]["dto.PostResponse"];
                        };
                    };
                };
                /** @description Bad Request */
                400: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": components["schemas"]["dto.ErrorResponse"];
                    };
                };
                /** @description Forbidden */
                403: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": components["schemas"]["dto.ErrorResponse"];
                    };
                };
                /** @description Not Found */
                404: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": components["schemas"]["dto.ErrorResponse"];
                    };
                };
                /** @description Internal Server Error */
                500: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": components["schemas"]["dto.ErrorResponse"];
                    };
                };
            };
        };
        /**
         * 글 수정
         * @description 작성자가 글을 수정합니다
         */
        put: {
            parameters: {
                query?: never;
                header: {
                    /** @description Bearer token */
                    Authorization: string;
                };
                path: {
                    /** @description 글 ID */
                    id: number;
                };
                cookie?: never;
            };
            requestBody: components["requestBodies"]["dto.UpdatePostRequest"];
            responses: {
                /** @description OK */
                200: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": components["schemas"]["dto.SuccessResponse"] & {
                            data?: components["schemas"]["dto.PostResponse"];
                        };
                    };
                };
                /** @description Bad Request */
                400: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": components["schemas"]["dto.ErrorResponse"];
                    };
                };
                /** @description Unauthorized */
                401: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": components["schemas"]["dto.ErrorResponse"];
                    };
                };
                /** @description Forbidden */
                403: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": components["schemas"]["dto.ErrorResponse"];
                    };
                };
                /** @description Not Found */
                404: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": components["schemas"]["dto.ErrorResponse"];
                    };
                };
                /** @description Internal Server Error */
                500: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": components["schemas"]["dto.ErrorResponse"];
                    };
                };
            };
        };
        post?: never;
        /**
         * 글 삭제
         * @description 작성자가 글을 삭제합니다
         */
        delete: {
            parameters: {
                query?: never;
                header: {
                    /** @description Bearer token */
                    Authorization: string;
                };
                path: {
                    /** @description 글 ID */
                    id: number;
                };
                cookie?: never;
            };
            requestBody?: never;
            responses: {
                /** @description 삭제 성공 */
                204: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content?: never;
                };
                /** @description Bad Request */
                400: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": components["schemas"]["dto.ErrorResponse"];
                    };
                };
                /** @description Unauthorized */
                401: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": components["schemas"]["dto.ErrorResponse"];
                    };
                };
                /** @description Forbidden */
                403: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": components["schemas"]["dto.ErrorResponse"];
                    };
                };
                /** @description Not Found */
                404: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": components["schemas"]["dto.ErrorResponse"];
                    };
                };
                /** @description Internal Server Error */
                500: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": components["schemas"]["dto.ErrorResponse"];
                    };
                };
            };
        };
        options?: never;
        head?: never;
        /**
         * 글 수정
         * @description 작성자가 글을 수정합니다
         */
        patch: {
            parameters: {
                query?: never;
                header: {
                    /** @description Bearer token */
                    Authorization: string;
                };
                path: {
                    /** @description 글 ID */
                    id: number;
                };
                cookie?: never;
            };
            requestBody: components["requestBodies"]["dto.UpdatePostRequest"];
            responses: {
                /** @description OK */
                200: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": components["schemas"]["dto.SuccessResponse"] & {
                            data?: components["schemas"]["dto.PostResponse"];
                        };
                    };
                };
                /** @description Bad Request */
                400: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": components["schemas"]["dto.ErrorResponse"];
                    };
                };
                /** @description Unauthorized */
                401: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": components["schemas"]["dto.ErrorResponse"];
                    };
                };
                /** @description Forbidden */
                403: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": components["schemas"]["dto.ErrorResponse"];
                    };
                };
                /** @description Not Found */
                404: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": components["schemas"]["dto.ErrorResponse"];
                    };
                };
                /** @description Internal Server Error */
                500: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": components["schemas"]["dto.ErrorResponse"];
                    };
                };
            };
        };
        trace?: never;
    };
    "/posts/{id}/comments": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /**
         * 댓글 목록 조회
         * @description 게시글의 댓글 목록을 트리 구조로 조회합니다
         */
        get: {
            parameters: {
                query?: {
                    /** @description 최대 댓글 수 (기본값: 200, 최대: 500) */
                    limit?: number;
                };
                header?: never;
                path: {
                    /** @description 게시글 ID */
                    id: number;
                };
                cookie?: never;
            };
            requestBody?: never;
            responses: {
                /** @description OK */
                200: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": components["schemas"]["dto.SuccessResponse"] & {
                            data?: components["schemas"]["dto.CommentListResponse"];
                        };
                    };
                };
                /** @description Bad Request */
                400: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": components["schemas"]["dto.ErrorResponse"];
                    };
                };
                /** @description Internal Server Error */
                500: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": components["schemas"]["dto.ErrorResponse"];
                    };
                };
            };
        };
        put?: never;
        /**
         * 댓글 작성
         * @description 게시글에 댓글을 작성합니다. parent_id를 지정하면 대댓글이 됩니다.
         */
        post: {
            parameters: {
                query?: never;
                header: {
                    /** @description Bearer token */
                    Authorization: string;
                };
                path: {
                    /** @description 게시글 ID */
                    id: number;
                };
                cookie?: never;
            };
            /** @description 댓글 내용 */
            requestBody: {
                content: {
                    "application/json": components["schemas"]["dto.CreateCommentRequest"];
                };
            };
            responses: {
                /** @description Created */
                201: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": components["schemas"]["dto.SuccessResponse"] & {
                            data?: components["schemas"]["dto.CommentResponse"];
                        };
                    };
                };
                /** @description Bad Request */
                400: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": components["schemas"]["dto.ErrorResponse"];
                    };
                };
                /** @description Unauthorized */
                401: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": components["schemas"]["dto.ErrorResponse"];
                    };
                };
                /** @description Not Found */
                404: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": components["schemas"]["dto.ErrorResponse"];
                    };
                };
                /** @description Internal Server Error */
                500: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": components["schemas"]["dto.ErrorResponse"];
                    };
                };
            };
        };
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/posts/{id}/comments/{comment_id}": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        /**
         * 댓글 수정
         * @description 작성자가 댓글을 수정합니다
         */
        put: {
            parameters: {
                query?: never;
                header: {
                    /** @description Bearer token */
                    Authorization: string;
                };
                path: {
                    /** @description 댓글 ID */
                    comment_id: number;
                    /** @description 게시글 ID */
                    id: number;
                };
                cookie?: never;
            };
            /** @description 수정할 댓글 내용 */
            requestBody: {
                content: {
                    "application/json": components["schemas"]["dto.UpdateCommentRequest"];
                };
            };
            responses: {
                /** @description OK */
                200: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": components["schemas"]["dto.SuccessResponse"] & {
                            data?: components["schemas"]["dto.CommentResponse"];
                        };
                    };
                };
                /** @description Bad Request */
                400: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": components["schemas"]["dto.ErrorResponse"];
                    };
                };
                /** @description Unauthorized */
                401: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": components["schemas"]["dto.ErrorResponse"];
                    };
                };
                /** @description Forbidden */
                403: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": components["schemas"]["dto.ErrorResponse"];
                    };
                };
                /** @description Not Found */
                404: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": components["schemas"]["dto.ErrorResponse"];
                    };
                };
                /** @description Internal Server Error */
                500: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": components["schemas"]["dto.ErrorResponse"];
                    };
                };
            };
        };
        post?: never;
        /**
         * 댓글 삭제
         * @description 작성자가 댓글을 삭제합니다. 하위 대댓글은 유지됩니다.
         */
        delete: {
            parameters: {
                query?: never;
                header: {
                    /** @description Bearer token */
                    Authorization: string;
                };
                path: {
                    /** @description 댓글 ID */
                    comment_id: number;
                    /** @description 게시글 ID */
                    id: number;
                };
                cookie?: never;
            };
            requestBody?: never;
            responses: {
                /** @description No Content */
                204: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content?: never;
                };
                /** @description Bad Request */
                400: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": components["schemas"]["dto.ErrorResponse"];
                    };
                };
                /** @description Unauthorized */
                401: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": components["schemas"]["dto.ErrorResponse"];
                    };
                };
                /** @description Forbidden */
                403: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": components["schemas"]["dto.ErrorResponse"];
                    };
                };
                /** @description Not Found */
                404: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": components["schemas"]["dto.ErrorResponse"];
                    };
                };
                /** @description Internal Server Error */
                500: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": components["schemas"]["dto.ErrorResponse"];
                    };
                };
            };
        };
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/posts/{id}/like": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /**
         * 좋아요 상태 조회
         * @description 현재 사용자가 해당 게시글을 좋아요했는지 확인합니다
         */
        get: {
            parameters: {
                query?: never;
                header?: {
                    /** @description Bearer token (로그인 시) */
                    Authorization?: string;
                };
                path: {
                    /** @description 글 ID */
                    id: number;
                };
                cookie?: never;
            };
            requestBody?: never;
            responses: {
                /** @description OK */
                200: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": components["schemas"]["dto.SuccessResponse"] & {
                            data?: components["schemas"]["dto.LikeStatusResponse"];
                        };
                    };
                };
                /** @description Bad Request */
                400: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": components["schemas"]["dto.ErrorResponse"];
                    };
                };
                /** @description Internal Server Error */
                500: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": components["schemas"]["dto.ErrorResponse"];
                    };
                };
            };
        };
        put?: never;
        /**
         * 좋아요 토글
         * @description 게시글의 좋아요를 토글합니다. 이미 좋아요한 경우 취소, 아닌 경우 추가됩니다.
         */
        post: {
            parameters: {
                query?: never;
                header: {
                    /** @description Bearer token */
                    Authorization: string;
                };
                path: {
                    /** @description 글 ID */
                    id: number;
                };
                cookie?: never;
            };
            requestBody?: never;
            responses: {
                /** @description OK */
                200: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": components["schemas"]["dto.SuccessResponse"] & {
                            data?: components["schemas"]["dto.LikeToggleResponse"];
                        };
                    };
                };
                /** @description Bad Request */
                400: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": components["schemas"]["dto.ErrorResponse"];
                    };
                };
                /** @description Unauthorized */
                401: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": components["schemas"]["dto.ErrorResponse"];
                    };
                };
                /** @description Internal Server Error */
                500: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": components["schemas"]["dto.ErrorResponse"];
                    };
                };
            };
        };
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/posts/{id}/series-nav": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /**
         * 시리즈 네비게이션 조회
         * @description 게시글이 속한 시리즈의 이전/다음 글 정보를 조회합니다. 글이 없거나, 볼 수 없거나, 시리즈에 없으면 data 는 null 입니다
         */
        get: {
            parameters: {
                query?: never;
                header?: never;
                path: {
                    /** @description 게시글 ID */
                    id: number;
                };
                cookie?: never;
            };
            requestBody?: never;
            responses: {
                /** @description OK */
                200: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": components["schemas"]["dto.SuccessResponse"] & {
                            data?: components["schemas"]["dto.SeriesNavResponse"];
                        };
                    };
                };
                /** @description Bad Request */
                400: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": components["schemas"]["dto.ErrorResponse"];
                    };
                };
                /** @description Internal Server Error */
                500: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": components["schemas"]["dto.ErrorResponse"];
                    };
                };
            };
        };
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/posts/search": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /**
         * 글 검색
         * @description 제목 또는 본문에서 키워드로 공개 글을 검색합니다
         */
        get: {
            parameters: {
                query: {
                    /** @description 페이지 번호 (기본값: 1) */
                    page?: number;
                    /** @description 페이지 크기 (기본값: 10) */
                    page_size?: number;
                    /** @description 검색어 (앞뒤 공백을 뺀 2~100자) */
                    q: string;
                };
                header?: never;
                path?: never;
                cookie?: never;
            };
            requestBody?: never;
            responses: {
                /** @description OK */
                200: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": components["schemas"]["dto.SuccessResponse"] & {
                            data?: components["schemas"]["dto.PostListWithPagination"];
                        };
                    };
                };
                /** @description Bad Request */
                400: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": components["schemas"]["dto.ErrorResponse"];
                    };
                };
                /** @description Internal Server Error */
                500: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": components["schemas"]["dto.ErrorResponse"];
                    };
                };
            };
        };
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/series": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        /**
         * 시리즈 생성
         * @description 새로운 시리즈를 생성합니다
         */
        post: {
            parameters: {
                query?: never;
                header: {
                    /** @description Bearer token */
                    Authorization: string;
                };
                path?: never;
                cookie?: never;
            };
            /** @description 시리즈 정보 */
            requestBody: {
                content: {
                    "application/json": components["schemas"]["dto.CreateSeriesRequest"];
                };
            };
            responses: {
                /** @description Created */
                201: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": components["schemas"]["dto.SuccessResponse"] & {
                            data?: components["schemas"]["dto.SeriesResponse"];
                        };
                    };
                };
                /** @description Bad Request */
                400: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": components["schemas"]["dto.ErrorResponse"];
                    };
                };
                /** @description Unauthorized */
                401: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": components["schemas"]["dto.ErrorResponse"];
                    };
                };
                /** @description Internal Server Error */
                500: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": components["schemas"]["dto.ErrorResponse"];
                    };
                };
            };
        };
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/series/{id}": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /**
         * 시리즈 상세 조회
         * @description 시리즈 ID로 시리즈 상세 정보와 포함된 글 목록을 조회합니다
         */
        get: {
            parameters: {
                query?: never;
                header?: never;
                path: {
                    /** @description 시리즈 ID */
                    id: number;
                };
                cookie?: never;
            };
            requestBody?: never;
            responses: {
                /** @description OK */
                200: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": components["schemas"]["dto.SuccessResponse"] & {
                            data?: components["schemas"]["dto.SeriesDetailResponse"];
                        };
                    };
                };
                /** @description Bad Request */
                400: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": components["schemas"]["dto.ErrorResponse"];
                    };
                };
                /** @description Not Found */
                404: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": components["schemas"]["dto.ErrorResponse"];
                    };
                };
                /** @description Internal Server Error */
                500: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": components["schemas"]["dto.ErrorResponse"];
                    };
                };
            };
        };
        /**
         * 시리즈 수정
         * @description 작성자가 시리즈 정보를 수정합니다
         */
        put: {
            parameters: {
                query?: never;
                header: {
                    /** @description Bearer token */
                    Authorization: string;
                };
                path: {
                    /** @description 시리즈 ID */
                    id: number;
                };
                cookie?: never;
            };
            /** @description 수정할 시리즈 정보 */
            requestBody: {
                content: {
                    "application/json": components["schemas"]["dto.UpdateSeriesRequest"];
                };
            };
            responses: {
                /** @description OK */
                200: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": components["schemas"]["dto.SuccessResponse"] & {
                            data?: components["schemas"]["dto.SeriesResponse"];
                        };
                    };
                };
                /** @description Bad Request */
                400: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": components["schemas"]["dto.ErrorResponse"];
                    };
                };
                /** @description Unauthorized */
                401: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": components["schemas"]["dto.ErrorResponse"];
                    };
                };
                /** @description Forbidden */
                403: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": components["schemas"]["dto.ErrorResponse"];
                    };
                };
                /** @description Not Found */
                404: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": components["schemas"]["dto.ErrorResponse"];
                    };
                };
                /** @description Internal Server Error */
                500: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": components["schemas"]["dto.ErrorResponse"];
                    };
                };
            };
        };
        post?: never;
        /**
         * 시리즈 삭제
         * @description 작성자가 시리즈를 삭제합니다. 포함된 글은 삭제되지 않습니다.
         */
        delete: {
            parameters: {
                query?: never;
                header: {
                    /** @description Bearer token */
                    Authorization: string;
                };
                path: {
                    /** @description 시리즈 ID */
                    id: number;
                };
                cookie?: never;
            };
            requestBody?: never;
            responses: {
                /** @description OK */
                200: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": components["schemas"]["dto.SuccessResponse"] & {
                            data?: components["schemas"]["dto.MessageResponse"];
                        };
                    };
                };
                /** @description Bad Request */
                400: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": components["schemas"]["dto.ErrorResponse"];
                    };
                };
                /** @description Unauthorized */
                401: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": components["schemas"]["dto.ErrorResponse"];
                    };
                };
                /** @description Forbidden */
                403: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": components["schemas"]["dto.ErrorResponse"];
                    };
                };
                /** @description Not Found */
                404: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": components["schemas"]["dto.ErrorResponse"];
                    };
                };
                /** @description Internal Server Error */
                500: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": components["schemas"]["dto.ErrorResponse"];
                    };
                };
            };
        };
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/series/{id}/posts": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        /**
         * 시리즈에 글 추가
         * @description 시리즈에 글을 추가합니다. 시리즈와 글 모두 본인 소유여야 합니다.
         */
        post: {
            parameters: {
                query?: never;
                header: {
                    /** @description Bearer token */
                    Authorization: string;
                };
                path: {
                    /** @description 시리즈 ID */
                    id: number;
                };
                cookie?: never;
            };
            /** @description 추가할 글 정보 */
            requestBody: {
                content: {
                    "application/json": components["schemas"]["dto.AddPostToSeriesRequest"];
                };
            };
            responses: {
                /** @description OK */
                200: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": components["schemas"]["dto.SuccessResponse"] & {
                            data?: components["schemas"]["dto.MessageResponse"];
                        };
                    };
                };
                /** @description Bad Request */
                400: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": components["schemas"]["dto.ErrorResponse"];
                    };
                };
                /** @description Unauthorized */
                401: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": components["schemas"]["dto.ErrorResponse"];
                    };
                };
                /** @description Forbidden */
                403: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": components["schemas"]["dto.ErrorResponse"];
                    };
                };
                /** @description Not Found */
                404: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": components["schemas"]["dto.ErrorResponse"];
                    };
                };
                /** @description Internal Server Error */
                500: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": components["schemas"]["dto.ErrorResponse"];
                    };
                };
            };
        };
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/series/{id}/posts/{post_id}": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        post?: never;
        /**
         * 시리즈에서 글 제거
         * @description 시리즈에서 글을 제거합니다. 글 자체는 삭제되지 않습니다.
         */
        delete: {
            parameters: {
                query?: never;
                header: {
                    /** @description Bearer token */
                    Authorization: string;
                };
                path: {
                    /** @description 시리즈 ID */
                    id: number;
                    /** @description 게시글 ID */
                    post_id: number;
                };
                cookie?: never;
            };
            requestBody?: never;
            responses: {
                /** @description OK */
                200: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": components["schemas"]["dto.SuccessResponse"] & {
                            data?: components["schemas"]["dto.MessageResponse"];
                        };
                    };
                };
                /** @description Bad Request */
                400: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": components["schemas"]["dto.ErrorResponse"];
                    };
                };
                /** @description Unauthorized */
                401: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": components["schemas"]["dto.ErrorResponse"];
                    };
                };
                /** @description Forbidden */
                403: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": components["schemas"]["dto.ErrorResponse"];
                    };
                };
                /** @description Not Found */
                404: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": components["schemas"]["dto.ErrorResponse"];
                    };
                };
                /** @description Internal Server Error */
                500: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": components["schemas"]["dto.ErrorResponse"];
                    };
                };
            };
        };
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/series/{id}/reorder": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        /**
         * 시리즈 글 순서 변경
         * @description 시리즈에 포함된 글의 순서를 변경합니다
         */
        put: {
            parameters: {
                query?: never;
                header: {
                    /** @description Bearer token */
                    Authorization: string;
                };
                path: {
                    /** @description 시리즈 ID */
                    id: number;
                };
                cookie?: never;
            };
            /** @description 새로운 글 순서 */
            requestBody: {
                content: {
                    "application/json": components["schemas"]["dto.ReorderPostsRequest"];
                };
            };
            responses: {
                /** @description OK */
                200: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": components["schemas"]["dto.SuccessResponse"] & {
                            data?: components["schemas"]["dto.MessageResponse"];
                        };
                    };
                };
                /** @description Bad Request */
                400: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": components["schemas"]["dto.ErrorResponse"];
                    };
                };
                /** @description Unauthorized */
                401: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": components["schemas"]["dto.ErrorResponse"];
                    };
                };
                /** @description Forbidden */
                403: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": components["schemas"]["dto.ErrorResponse"];
                    };
                };
                /** @description Not Found */
                404: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": components["schemas"]["dto.ErrorResponse"];
                    };
                };
                /** @description Internal Server Error */
                500: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": components["schemas"]["dto.ErrorResponse"];
                    };
                };
            };
        };
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/tags": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /**
         * 태그 목록 조회
         * @description 공개 글에 사용된 태그 목록을 사용 횟수와 함께 반환합니다
         */
        get: {
            parameters: {
                query?: {
                    /** @description 최대 반환 개수 (기본 50, 최대 200) */
                    limit?: number;
                    /** @description 정렬 기준: popular(기본) 또는 name */
                    sort?: string;
                };
                header?: never;
                path?: never;
                cookie?: never;
            };
            requestBody?: never;
            responses: {
                /** @description OK */
                200: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": components["schemas"]["dto.SuccessResponse"] & {
                            data?: components["schemas"]["dto.TagListResponse"];
                        };
                    };
                };
                /** @description Internal Server Error */
                500: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": components["schemas"]["dto.ErrorResponse"];
                    };
                };
            };
        };
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/upload": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        /**
         * 이미지 업로드
         * @description 이미지 파일을 서버에 업로드합니다 (최대 5MB, jpeg/png/gif/webp)
         */
        post: {
            parameters: {
                query?: never;
                header?: never;
                path?: never;
                cookie?: never;
            };
            requestBody: {
                content: {
                    "multipart/form-data": {
                        /**
                         * Format: binary
                         * @description 업로드할 이미지 파일
                         */
                        image: string;
                    };
                };
            };
            responses: {
                /** @description OK */
                200: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": components["schemas"]["dto.SuccessResponse"] & {
                            data?: components["schemas"]["dto.ImageUploadResponse"];
                        };
                    };
                };
                /** @description Bad Request */
                400: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": components["schemas"]["dto.ErrorResponse"];
                    };
                };
                /** @description Unauthorized */
                401: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": components["schemas"]["dto.ErrorResponse"];
                    };
                };
                /** @description Internal Server Error */
                500: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": components["schemas"]["dto.ErrorResponse"];
                    };
                };
            };
        };
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/users/{user_id}": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /**
         * 유저 프로필 조회
         * @description 유저 ID로 프로필 정보를 조회합니다
         */
        get: {
            parameters: {
                query?: never;
                header?: never;
                path: {
                    /** @description 유저 ID */
                    user_id: number;
                };
                cookie?: never;
            };
            requestBody?: never;
            responses: {
                /** @description OK */
                200: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": components["schemas"]["dto.SuccessResponse"] & {
                            data?: components["schemas"]["dto.UserResponse"];
                        };
                    };
                };
                /** @description Bad Request */
                400: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": components["schemas"]["dto.ErrorResponse"];
                    };
                };
                /** @description Not Found */
                404: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": components["schemas"]["dto.ErrorResponse"];
                    };
                };
                /** @description Internal Server Error */
                500: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": components["schemas"]["dto.ErrorResponse"];
                    };
                };
            };
        };
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/users/{user_id}/posts": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /**
         * 사용자 글 목록 조회
         * @description 특정 사용자의 모든 글을 조회합니다
         */
        get: {
            parameters: {
                query?: {
                    /** @description 페이지 번호 (기본값: 1) */
                    page?: number;
                    /** @description 페이지 크기 (기본값: 10) */
                    page_size?: number;
                    /** @description 태그 이름으로 거르기 */
                    tag?: string;
                };
                header?: never;
                path: {
                    /** @description 사용자 ID */
                    user_id: number;
                };
                cookie?: never;
            };
            requestBody?: never;
            responses: {
                /** @description OK */
                200: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": components["schemas"]["dto.SuccessResponse"] & {
                            data?: components["schemas"]["dto.PostListWithPagination"];
                        };
                    };
                };
                /** @description Bad Request */
                400: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": components["schemas"]["dto.ErrorResponse"];
                    };
                };
                /** @description Internal Server Error */
                500: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": components["schemas"]["dto.ErrorResponse"];
                    };
                };
            };
        };
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/users/{user_id}/series": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /**
         * 사용자 시리즈 목록 조회
         * @description 특정 사용자의 시리즈 목록을 조회합니다
         */
        get: {
            parameters: {
                query?: never;
                header?: never;
                path: {
                    /** @description 사용자 ID */
                    user_id: number;
                };
                cookie?: never;
            };
            requestBody?: never;
            responses: {
                /** @description OK */
                200: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": components["schemas"]["dto.SuccessResponse"] & {
                            data?: components["schemas"]["dto.SeriesResponse"][];
                        };
                    };
                };
                /** @description Bad Request */
                400: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": components["schemas"]["dto.ErrorResponse"];
                    };
                };
                /** @description Internal Server Error */
                500: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": components["schemas"]["dto.ErrorResponse"];
                    };
                };
            };
        };
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/users/avatar": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        /**
         * 프로필 이미지 업로드
         * @description 프로필 이미지를 업로드합니다 (최대 5MB, jpeg/png/gif/webp)
         */
        put: {
            parameters: {
                query?: never;
                header?: never;
                path?: never;
                cookie?: never;
            };
            requestBody: {
                content: {
                    "multipart/form-data": {
                        /**
                         * Format: binary
                         * @description 프로필 이미지 파일
                         */
                        avatar: string;
                    };
                };
            };
            responses: {
                /** @description OK */
                200: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": components["schemas"]["dto.SuccessResponse"] & {
                            data?: components["schemas"]["dto.AvatarResponse"];
                        };
                    };
                };
                /** @description Bad Request */
                400: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": components["schemas"]["dto.ErrorResponse"];
                    };
                };
                /** @description Unauthorized */
                401: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": components["schemas"]["dto.ErrorResponse"];
                    };
                };
                /** @description Internal Server Error */
                500: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": components["schemas"]["dto.ErrorResponse"];
                    };
                };
            };
        };
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/users/me": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        post?: never;
        /**
         * 계정 삭제
         * @description 현재 로그인한 사용자의 계정과 모든 데이터를 삭제합니다
         */
        delete: {
            parameters: {
                query?: never;
                header?: never;
                path?: never;
                cookie?: never;
            };
            requestBody?: never;
            responses: {
                /** @description No Content */
                204: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content?: never;
                };
                /** @description Unauthorized */
                401: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": components["schemas"]["dto.ErrorResponse"];
                    };
                };
                /** @description Internal Server Error */
                500: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": components["schemas"]["dto.ErrorResponse"];
                    };
                };
            };
        };
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/users/password": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        /**
         * 비밀번호 변경
         * @description 현재 비밀번호를 확인한 후 새 비밀번호로 변경합니다. 다른 기기의 리프레시 토큰은 무효가 되고, 응답의 새 토큰 쌍으로 이 기기 세션을 이어 간다
         */
        put: {
            parameters: {
                query?: never;
                header: {
                    /** @description Bearer token */
                    Authorization: string;
                };
                path?: never;
                cookie?: never;
            };
            /** @description 비밀번호 변경 정보 */
            requestBody: {
                content: {
                    "application/json": components["schemas"]["dto.ChangePasswordRequest"];
                };
            };
            responses: {
                /** @description OK */
                200: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": components["schemas"]["dto.SuccessResponse"] & {
                            data?: components["schemas"]["dto.AuthDataResponse"];
                        };
                    };
                };
                /** @description Bad Request */
                400: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": components["schemas"]["dto.ErrorResponse"];
                    };
                };
                /** @description Unauthorized */
                401: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": components["schemas"]["dto.ErrorResponse"];
                    };
                };
                /** @description Forbidden */
                403: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": components["schemas"]["dto.ErrorResponse"];
                    };
                };
                /** @description Internal Server Error */
                500: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": components["schemas"]["dto.ErrorResponse"];
                    };
                };
            };
        };
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
}
export type webhooks = Record<string, never>;
export interface components {
    schemas: {
        "dto.AddPostToSeriesRequest": {
            order?: number;
            post_id: number;
        };
        "dto.AuthDataResponse": {
            access_token: string;
            avatar_url: string;
            refresh_token: string;
            user_id: number;
            username: string;
        };
        "dto.AvatarResponse": {
            avatar_url: string;
        };
        "dto.ChangePasswordRequest": {
            current_password: string;
            new_password: string;
        };
        "dto.CommentListResponse": {
            comments: components["schemas"]["dto.CommentResponse"][];
            total: number;
        };
        "dto.CommentResponse": {
            author: string;
            avatar_url: string;
            content: string;
            created_at: string;
            id: number;
            is_edited: boolean;
            parent_id: number | null;
            post_id: number;
            replies: components["schemas"]["dto.CommentResponse"][];
            updated_at: string;
            user_id: number;
        };
        "dto.CreateCommentRequest": {
            content: string;
            parent_id?: number;
        };
        "dto.CreatePostRequest": {
            content: string;
            is_public?: boolean;
            /** @enum {string} */
            status?: "draft" | "published";
            tags?: string;
            title: string;
        };
        "dto.CreateSeriesRequest": {
            description?: string;
            title: string;
        };
        "dto.ErrorResponse": {
            error: string;
            message?: string;
            status: string;
        };
        "dto.ImageUploadResponse": {
            url: string;
        };
        "dto.LikeStatusResponse": {
            liked: boolean;
        };
        "dto.LikeToggleResponse": {
            like_count: number;
            liked: boolean;
        };
        "dto.LoginRequest": {
            password: string;
            username: string;
        };
        "dto.MessageResponse": {
            message: string;
        };
        "dto.Pagination": {
            page: number;
            page_size: number;
            total: number;
            total_pages: number;
        };
        "dto.PostListResponse": {
            author: string;
            created_at: string;
            excerpt: string;
            id: number;
            is_public: boolean;
            like_count: number;
            series?: components["schemas"]["dto.SeriesInfo"];
            status: string;
            tags: string;
            title: string;
            updated_at: string;
            user_id: number;
            view_count: number;
        };
        "dto.PostListWithPagination": {
            pagination: components["schemas"]["dto.Pagination"];
            posts: components["schemas"]["dto.PostListResponse"][] | null;
        };
        "dto.PostResponse": {
            author: string;
            content: string;
            created_at: string;
            id: number;
            is_public: boolean;
            like_count: number;
            series?: components["schemas"]["dto.SeriesInfo"];
            status: string;
            tags: string;
            title: string;
            updated_at: string;
            user_id: number;
            view_count: number;
        };
        "dto.RefreshTokenRequest": {
            refresh_token: string;
        };
        "dto.RegisterRequest": {
            password: string;
            username: string;
        };
        "dto.ReorderPostsRequest": {
            post_ids: number[];
        };
        "dto.SeriesDetailResponse": {
            author: string;
            created_at: string;
            description: string;
            id: number;
            posts: components["schemas"]["dto.SeriesPostItem"][];
            title: string;
            updated_at: string;
            user_id: number;
        };
        "dto.SeriesInfo": {
            series_id: number;
            series_order: number;
            series_title: string;
        };
        "dto.SeriesNavPost": {
            id: number;
            title: string;
        };
        "dto.SeriesNavResponse": {
            current_order: number;
            next_post: components["schemas"]["dto.SeriesNavPost"] | null;
            prev_post: components["schemas"]["dto.SeriesNavPost"] | null;
            series_id: number;
            series_title: string;
            total_posts: number;
        };
        "dto.SeriesPostItem": {
            created_at: string;
            id: number;
            order: number;
            title: string;
        };
        "dto.SeriesResponse": {
            author: string;
            created_at: string;
            description: string;
            id: number;
            post_count: number;
            title: string;
            updated_at: string;
            user_id: number;
        };
        "dto.SuccessResponse": {
            data: unknown;
            status: string;
        };
        "dto.TagListResponse": {
            tags: components["schemas"]["dto.TagResponse"][];
            total: number;
        };
        "dto.TagResponse": {
            name: string;
            post_count: number;
        };
        "dto.UpdateCommentRequest": {
            content: string;
        };
        "dto.UpdatePostRequest": {
            content?: string;
            is_public?: boolean;
            /** @enum {string} */
            status?: "draft" | "published";
            tags?: string;
            title?: string;
        };
        "dto.UpdateSeriesRequest": {
            description?: string;
            title?: string;
        };
        "dto.UserResponse": {
            avatar_url: string;
            created_at: string;
            id: number;
            last_login: string;
            username: string;
        };
    };
    responses: never;
    parameters: never;
    requestBodies: {
        /** @description 수정할 내용 */
        "dto.UpdatePostRequest": {
            content: {
                "application/json": components["schemas"]["dto.UpdatePostRequest"];
            };
        };
    };
    headers: never;
    pathItems: never;
}
export type $defs = Record<string, never>;
export type operations = Record<string, never>;
