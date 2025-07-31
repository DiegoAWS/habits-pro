// TODO Update this file with the correct schema
export type Database = {
    public: {
        Tables: {
            habits: {
                Row: {
                    id: string;
                    name: string;
                    schedule_type: string;
                    target_frequency: number;
                    color_rgb: string;
                    created_at: string;
                };
                Insert: {
                    name: string;
                    schedule_type: string;
                    target_frequency: number;
                    color_rgb: string;
                };
                Update: {
                    name?: string;
                    schedule_type?: string;
                    target_frequency?: number;
                    color_rgb?: string;
                };
            };
        };
    };
};