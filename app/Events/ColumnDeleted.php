<?php

namespace App\Events;

use Illuminate\Broadcasting\InteractsWithSockets;
use Illuminate\Broadcasting\PrivateChannel;
use Illuminate\Contracts\Broadcasting\ShouldBroadcast;
use Illuminate\Foundation\Events\Dispatchable;
use Illuminate\Queue\SerializesModels;

class ColumnDeleted implements ShouldBroadcast
{
    use Dispatchable, InteractsWithSockets, SerializesModels;

    public int $columnId;
    public int $boardId;
    public array $columnIds;

    public function __construct(int $columnId, int $boardId, array $columnIds = [])
    {
        $this->columnId = $columnId;
        $this->boardId = $boardId;
        $this->columnIds = $columnIds;
    }

    public function broadcastOn(): array
    {
        return [
            new PrivateChannel('board.' . $this->boardId),
        ];
    }

    public function broadcastAs(): string
    {
        return 'column.deleted';
    }

    public function broadcastWith(): array
    {
        return [
            'column_id' => $this->columnId,
            'column_ids' => $this->columnIds,
        ];
    }
}
