export interface DiscordUserInterface {
    id:                     string;
    username:               string;
    discriminator:          string;
    avatar:                 string;
    verified:               boolean;
    email:                  string;
    flags:                  number;
    banner:                 string;
    accent_color:           number;
    premium_type:           number;
    public_flags:           number;
    avatar_decoration_data: AvatarDecorationData;
}

interface AvatarDecorationData {
    sku_id: string;
    asset:  string;
}