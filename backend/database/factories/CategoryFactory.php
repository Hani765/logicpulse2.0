<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;
use Illuminate\Support\Str;
use App\Models\Category;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Category>
 */
class CategoryFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition()
    {
        $categories = [
            'Electronics',
            'Fashion',
            'Home and Kitchen',
            'Sports and Outdoors',
            'Health and Beauty',
            'Toys and Games',
            'Automotive',
            'Books',
            'Music',
            'Movies and TV',
            'Grocery',
            'Pet Supplies',
            'Office Products',
            'Tools and Home Improvement',
            'Garden and Outdoor',
            'Baby',
            'Arts, Crafts and Sewing',
            'Industrial and Scientific',
            'Luggage and Travel Gear',
            'Software',
            'Video Games',
            'Appliances',
            'Cell Phones and Accessories',
            'Cameras and Photo',
            'Computers',
            'Video Projectors',
            'Wearable Technology',
            'Smart Home',
            'Musical Instruments',
            'Networking Products',
            'Printers',
            'Scanners',
            'Security and Surveillance',
            'Video Games Accessories',
            'Costumes and Accessories',
            'Seasonal Décor',
            'Party Supplies',
            'Event Supplies',
            'Personal Care Appliances',
            'Men’s Fashion',
            'Women’s Fashion',
            'Kids’ Fashion',
            'Shoe Accessories',
            'Handbags',
            'Wallets',
            'Watches',
            'Jewelry',
            'Sunglasses',
            'Eyewear Accessories',
            'Footwear',
            'Activewear',
            'Formal Wear',
            'Casual Wear',
            'Undergarments',
            'Sleepwear',
            'Swimwear',
            'Costumes',
            'Hair Care',
            'Skin Care',
            'Makeup',
            'Fragrance',
            'Nail Care',
            'Beauty Tools',
            'Supplements',
            'Medical Supplies',
            'Fitness Equipment',
            'Outdoor Recreation',
            'Camping and Hiking',
            'Cycling',
            'Fishing',
            'Golf',
            'Hunting',
            'Climbing',
            'Running',
            'Skiing and Snowboarding',
            'Water Sports',
            'Team Sports',
            'Exercise and Fitness',
            'Gift Cards',
            'Collectibles',
            'Hobbies',
            'Model Building',
            'Remote Control Toys',
            'Stuffed Animals and Plush Toys',
            'Puzzles',
            'Board Games',
            'Card Games',
            'Video Games',
            'Digital Music',
            'Vinyl Records',
            'Musical Instruments',
            'Sheet Music',
            'Accessories for Musical Instruments',
            'Office Supplies',
            'Furniture',
            'Packaging Supplies',
            'Cleaning Supplies',
            'School Supplies',
            'Craft Supplies',
            'Print Advertising Products',
            'Event and Party Supplies',
            'General Merchandise',
        ];

        return [
            'unique_id' => Str::uuid()->toString(),
            'name' => $this->faker->unique()->randomElement($categories),
        ];
    }

}
