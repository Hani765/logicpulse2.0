<?php
namespace App\Events;

use Illuminate\Broadcasting\Channel;
use Illuminate\Broadcasting\PrivateChannel;
use Illuminate\Contracts\Broadcasting\ShouldBroadcastNow;
use Illuminate\Foundation\Events\Dispatchable;
use Illuminate\Queue\SerializesModels;

class NotificationSent implements ShouldBroadcastNow
{
    use Dispatchable, SerializesModels;

    public $notification;
    public $userIds;
    public $roles;

    /**
     * Create a new event instance.
     */
    public function __construct($notification, $userIds = [], $roles = [])
    {
        $this->notification = $notification;
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
                $channels[] = new PrivateChannel('notifications.' . $userId);
            }
        }

        // Broadcast to specified roles
        if (!empty($this->roles)) {
            foreach ($this->roles as $role) {
                $channels[] = new PrivateChannel('notifications.role.' . $role);
            }
        }

        return $channels;
    }

    /**
     * Optionally, specify the event name for broadcasting.
     */
    public function broadcastAs(): string
    {
        return 'notification.sent';
    }
}
