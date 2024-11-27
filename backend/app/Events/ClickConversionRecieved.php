<?php
namespace App\Events;

use Illuminate\Broadcasting\Channel;
use Illuminate\Broadcasting\PrivateChannel;
use Illuminate\Contracts\Broadcasting\ShouldBroadcastNow;
use Illuminate\Foundation\Events\Dispatchable;
use Illuminate\Queue\SerializesModels;

class ClickConversionRecieved implements ShouldBroadcastNow
{
    use Dispatchable, SerializesModels;

    public $clickConversion;
    public $userIds;
    public $roles;

    /**
     * Create a new event instance.
     */
    public function __construct($clickConversion, array $userIds = [], array $roles = [])
    {
        $this->clickConversion = $clickConversion;
        $this->userIds = $userIds;
        $this->roles = $roles;
    }

    /**
     * Get the channels the event should broadcast on.
     */
    public function broadcastOn(): array
    {
        $channels = [];

        // Broadcast to specified user IDs
        if (!empty($this->userIds)) {
            foreach ($this->userIds as $userId) {
                $channels[] = new PrivateChannel('clickConversion.' . $userId);
            }
        }

        // Broadcast to specified roles
        if (!empty($this->roles)) {
            foreach ($this->roles as $role) {
                $channels[] = new PrivateChannel('clickConversion.role.' . $role);
            }
        }

        return $channels;
    }

    /**
     * Optionally, specify the event name for broadcasting.
     */
    public function broadcastAs(): string
    {
        return 'clickConversion.sent';
    }
}
