<?php

namespace Database\Factories;

use App\Models\Click;
use App\Models\Conversion;
use App\Models\User;
use App\Models\Network;
use App\Models\Offers;
use App\Models\Domain;
use App\Models\Tracker;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Conversion>
 */
class ConversionFactory extends Factory
{
    /**
     * The name of the factory's corresponding model.
     *
     * @var string
     */
    protected $model = Conversion::class;

    /**
     * Define the model's default state.
     *
     * @return array
     */
    public function definition()
    {
        $clickId = Click::inRandomOrder()->value('unique_id');
        $adminUserIds = User::where('role', 'user')->pluck('unique_id');
        $managerUserIds = User::where('role', 'manager')->pluck('unique_id');
        $networkId = Network::inRandomOrder()->value('unique_id');
        $offerId = Offers::inRandomOrder()->value('unique_id');
        $domainId = Domain::inRandomOrder()->value('unique_id');
        $trackerId = Tracker::inRandomOrder()->value('unique_id');

        $createdAt = $this->faker->dateTimeBetween('-1 month', 'now');
        $updatedAt = $this->faker->dateTimeBetween($createdAt, 'now');

        return [
            'unique_id' => $this->faker->uuid,
            'clicks_id' => $clickId,
            'offer_id' => $offerId,
            'network_id' => $networkId,
            'tracker_id' => $trackerId,
            'domain_id' => $domainId,
            'user_id' => $this->faker->randomElement($adminUserIds),
            'manager_id' => $this->faker->randomElement($managerUserIds),
            'admin_id' => $this->faker->randomElement($adminUserIds),
            'ip_address' => $this->faker->ipv4,
            'ip_score' => $this->faker->randomNumber(2),
            'country' => $this->faker->country,
            'city' => $this->faker->city,
            'device' => $this->faker->word,
            'device_version' => $this->faker->word,
            'browser' => $this->faker->word,
            'version' => $this->faker->randomFloat(1, 1, 10),
            'status' => $this->faker->randomElement(['pending', 'approved', 'rejected']),
            'created_at' => $createdAt,
            'updated_at' => $updatedAt,
        ];
    }
}
