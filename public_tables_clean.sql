


CREATE TABLE public.brands (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    name text NOT NULL,
    PRIMARY KEY (id),
    UNIQUE (name)
);

CREATE TABLE public.categories (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    name text NOT NULL,
    parent_id uuid,
    image text NOT NULL,
    slug text,
    is_listed boolean DEFAULT true NOT NULL,
    PRIMARY KEY (id),
    UNIQUE (slug)
);

CREATE TABLE public.colors (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    name text NOT NULL,
    hex_code text NOT NULL,
    PRIMARY KEY (id)
);

CREATE TABLE public.sizes (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    name text NOT NULL,
    category_id uuid NOT NULL,
    PRIMARY KEY (id)
);

CREATE TABLE public.products (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    name text NOT NULL,
    description text,
    category_id uuid NOT NULL,
    brand_id uuid NOT NULL,
    price numeric(10,2) NOT NULL,
    care_instruction text,
    is_new boolean,
    is_listed boolean DEFAULT true NOT NULL,
    PRIMARY KEY (id)
);

CREATE TABLE public.product_variants (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    product_id uuid NOT NULL,
    color_id uuid NOT NULL,
    sku text NOT NULL,
    name text,
    slug varchar(255),
    is_listed boolean DEFAULT true NOT NULL,
    PRIMARY KEY (id)
);

CREATE TABLE public.product_units (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    variant_id uuid NOT NULL,
    stock_quantity integer DEFAULT 0,
    size_id uuid NOT NULL,
    PRIMARY KEY (id)
);

CREATE TABLE public.product_variant_images (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    variant_id uuid NOT NULL,
    image_url text NOT NULL,
    PRIMARY KEY (id)
);

CREATE TABLE public.carts (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    user_id uuid NOT NULL,
    created_at timestamp DEFAULT now(),
    product_unit_id uuid NOT NULL,
    quantity integer DEFAULT 1 CHECK (quantity > 0),
    added_at timestamp DEFAULT now(),
    PRIMARY KEY (id)
);

CREATE TABLE public.orders (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    user_id uuid NOT NULL,
    product_unit_id uuid NOT NULL,
    quantity integer NOT NULL CHECK (quantity > 0),
    price numeric(10,2) NOT NULL CHECK (price >= 0),
    shipping_status varchar(20) DEFAULT 'ordered' NOT NULL,
    estimated_delivery timestamp,
    tracking_number varchar(100),
    payment_status varchar(20) DEFAULT 'unpaid',
    created_at timestamp DEFAULT now(),
    address_id uuid NOT NULL,
    order_number text,
    payment_method text,
    PRIMARY KEY (id),
    UNIQUE (tracking_number)
);

CREATE TABLE public.reviews (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    user_id uuid NOT NULL,
    product_variant_id uuid NOT NULL,
    rating integer NOT NULL CHECK (rating BETWEEN 1 AND 5),
    review_text text,
    created_at timestamp DEFAULT now(),
    PRIMARY KEY (id)
);

CREATE TABLE public.wishlist (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    user_id uuid NOT NULL,
    product_unit_id uuid NOT NULL,
    added_at timestamp DEFAULT now(),
    PRIMARY KEY (id)
);
